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
import { getStoredUser } from "../utils/purchaseStorage";
import { markCoursePurchased, markStagePurchased } from "../utils/purchaseStorage";
import { getStages, getAllCourses } from "../utils/courseData";

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
		try {
			if (isFullAccess) {
				const allStages = getStages();
				const allCourses = getAllCourses();
				
				for (const stage of allStages) {
					const courseIds = stage.courses.map(c => c.id);
					await markStagePurchased(stage.id, courseIds);
				}
			} else {
				if (courseId) {
					await markCoursePurchased(courseId);
				}
				if (stageId) {
					const allStages = getStages();
					const stage = allStages.find(s => s.id === stageId);
					if (stage) {
						const courseIds = stage.courses.map(c => c.id);
						await markStagePurchased(stageId, courseIds);
					}
				}
			}

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
			console.error("Failed to save purchase:", error);
		}
	};

	const handleNavigationStateChange = async (navState: any) => {
		const url = navState.url;

		if (url.includes("/api/payment/success") || url.includes("test-payment-success") || url.includes("payment-success") || url.includes("success")) {
			if (paymentStatus === "pending") {
				setPaymentStatus("success");
				handlePaymentSuccess();
			}
		} else if (url.includes("/api/payment/cancel") || url.includes("test-payment-fail") || url.includes("payment-failed") || url.includes("fail") || url.includes("error")) {
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

