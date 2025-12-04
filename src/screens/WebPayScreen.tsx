import React, { useState, useRef } from "react";
import {
	ActivityIndicator,
	Alert,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { WebView } from "react-native-webview";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../navigation/types";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from "../consts/consts";
import { getStoredUser, persistUserLocally } from "../utils/purchaseStorage";
import { getStages, getAllCourses } from "../utils/courseData";
import { updateCurrentUser, fetchCurrentUser } from "../services/userService";

type WebPayScreenNavigationProp = NativeStackNavigationProp<
	MainStackParamList,
	"WebPayScreen"
>;

type WebPayScreenRouteProp = RouteProp<MainStackParamList, "WebPayScreen">;

export default function WebPayScreen() {
	const { t } = useTranslation();
	const navigation = useNavigation<WebPayScreenNavigationProp>();
	const route = useRoute<WebPayScreenRouteProp>();
	const webViewRef = useRef<WebView>(null);

	const { paymentUrl, courseId, stageId, amount, description, isFullAccess } = route.params;

	const [loading, setLoading] = useState(true);
	const [paymentStatus, setPaymentStatus] = useState<"pending" | "success" | "failed">("pending");

	const handleMessage = (event: any) => {
		try {
			const data = JSON.parse(event.nativeEvent.data);
			if (data.type === "payment-success") {
				if (paymentStatus === "pending") {
					setPaymentStatus("success");
					handlePaymentSuccess(data.paymentId);
				}
			} else if (data.type === "payment-failed") {
				if (paymentStatus === "pending") {
					setPaymentStatus("failed");
					Alert.alert(
						t("payment.errorTitle") || "Ошибка",
						t("payment.paymentFailed") || "Платеж не был обработан",
						[
							{
								text: "OK",
								onPress: () => navigation.goBack(),
							},
						]
					);
				}
			}
		} catch (error) {
			console.error("Failed to parse WebView message:", error);
		}
	};

	const handlePaymentSuccess = async (paymentId?: string) => {
		console.log("[WebPayScreen] handlePaymentSuccess called");
		console.log("[WebPayScreen] isFullAccess:", isFullAccess);
		console.log("[WebPayScreen] courseId:", courseId);
		console.log("[WebPayScreen] stageId:", stageId);

		try {
			let updatedUser = await getStoredUser();
			let newOpenCategories: number[] = [...(updatedUser?.openCategories ?? [])];
			let newPurchasedStages: number[] = [...(updatedUser?.purchasedStages ?? [])];

			if (isFullAccess) {
				console.log("[WebPayScreen] Processing FULL ACCESS purchase");
				const allStages = getStages();
				
				for (const stage of allStages) {
					const courseIds = stage.courses.map(c => c.id);
					// Add stage to purchasedStages
					if (!newPurchasedStages.includes(stage.id)) {
						newPurchasedStages.push(stage.id);
					}
					// Add all courses from stage
					for (const cId of courseIds) {
						if (!newOpenCategories.includes(cId)) {
							newOpenCategories.push(cId);
						}
					}
				}
				console.log("[WebPayScreen] Full access prepared");
			} else {
				if (courseId) {
					console.log(`[WebPayScreen] Adding course ${courseId} to purchase`);
					if (!newOpenCategories.includes(courseId)) {
						newOpenCategories.push(courseId);
					}
				}
				if (stageId) {
					console.log(`[WebPayScreen] Adding stage ${stageId} to purchase`);
					const allStages = getStages();
					const stage = allStages.find(s => s.id === stageId);
					if (stage) {
						const courseIds = stage.courses.map(c => c.id);
						// Add stage
						if (!newPurchasedStages.includes(stageId)) {
							newPurchasedStages.push(stageId);
						}
						// Add all courses from stage
						for (const cId of courseIds) {
							if (!newOpenCategories.includes(cId)) {
								newOpenCategories.push(cId);
							}
						}
					}
				}
			}

			// Sync with server (PRIMARY SOURCE OF TRUTH)
			console.log("[WebPayScreen] Syncing with server...");
			console.log("[WebPayScreen] openCategories:", newOpenCategories);
			console.log("[WebPayScreen] purchasedStages:", newPurchasedStages);
			
			await updateCurrentUser({
				openCategories: newOpenCategories,
				purchasedStages: newPurchasedStages,
			});
			console.log("[WebPayScreen] Server sync successful");
			
			// Fetch fresh data from server and cache locally
			const freshUser = await fetchCurrentUser();
			await persistUserLocally(freshUser);
			console.log("[WebPayScreen] Local cache updated with server data");

			Alert.alert(
				t("payment.successTitle") || "Успешно",
				t("payment.purchaseSuccess") || "Платеж успешно обработан",
				[
					{
						text: "OK",
						onPress: () => navigation.goBack(),
					},
				]
			);
		} catch (error) {
			console.error("[WebPayScreen] Failed to save purchase:", error);
			Alert.alert("Ошибка", "Не удалось сохранить покупку: " + String(error));
		}
	};

	const handleNavigationStateChange = async (navState: any) => {
		const url = navState.url;
		console.log("[WebPayScreen] Navigation URL:", url);

		// Check for success patterns
		const isSuccess = 
			url.includes("/api/payment/success") || 
			url.includes("test-payment-success") || 
			url.includes("payment-success") ||
			url.includes("childapp://payment-success") ||
			(url.includes("success") && !url.includes("fail"));

		// Check for failure/cancel patterns
		const isFailure = 
			url.includes("/api/payment/cancel") || 
			url.includes("test-payment-fail") || 
			url.includes("payment-failed") ||
			url.includes("payment-cancel") ||
			url.includes("childapp://payment-cancel");

		if (isSuccess && paymentStatus === "pending") {
			console.log("[WebPayScreen] Payment SUCCESS detected!");
			setPaymentStatus("success");
			await handlePaymentSuccess();
		} else if (isFailure && paymentStatus === "pending") {
			console.log("[WebPayScreen] Payment FAILED/CANCELLED detected!");
			setPaymentStatus("failed");
			Alert.alert(
				t("payment.errorTitle") || "Ошибка",
				t("payment.paymentFailed") || "Платеж не был обработан",
				[
					{
						text: "OK",
						onPress: () => navigation.goBack(),
					},
				]
			);
		}
	};

	const handleClose = () => {
		if (paymentStatus === "pending") {
			Alert.alert(
				t("payment.confirmClose") || "Закрыть оплату?",
				t("payment.confirmCloseMessage") || "Оплата еще не завершена. Вы уверены, что хотите закрыть?",
				[
					{
						text: t("payment.cancel") || "Отмена",
						style: "cancel",
					},
					{
						text: t("payment.close") || "Закрыть",
						onPress: () => navigation.goBack(),
					},
				]
			);
		} else {
			navigation.goBack();
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>{t("payment.paymentTitle")}</Text>
				<TouchableOpacity onPress={handleClose} style={styles.closeButton}>
					<Ionicons name="close" size={24} color="#000" />
				</TouchableOpacity>
			</View>

			{loading && (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color="#2563EB" />
					<Text style={styles.loadingText}>{t("payment.loading")}</Text>
				</View>
			)}

			<WebView
				ref={webViewRef}
				source={{ uri: paymentUrl }}
				style={styles.webview}
				onNavigationStateChange={handleNavigationStateChange}
				onMessage={handleMessage}
				onLoadStart={() => setLoading(true)}
				onLoadEnd={() => setLoading(false)}
				javaScriptEnabled={true}
				domStorageEnabled={true}
				onError={(syntheticEvent) => {
					const { nativeEvent } = syntheticEvent;
					console.error("WebView error: ", nativeEvent);
					Alert.alert(
						t("payment.errorTitle") || "Ошибка",
						nativeEvent.description || t("payment.errorGeneric") || "Произошла ошибка при загрузке страницы оплаты"
					);
				}}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFFFFF",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#E5E7EB",
	},
	headerTitle: {
		fontSize: 18,
		fontFamily: "Nunito-Regular",
		color: "#1F2937",
	},
	closeButton: {
		padding: 4,
	},
	loadingContainer: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(255, 255, 255, 0.9)",
		zIndex: 1,
	},
	loadingText: {
		marginTop: 12,
		fontSize: 16,
		fontFamily: "Nunito-Regular",
		color: "#6B7280",
	},
	webview: {
		flex: 1,
	},
});

