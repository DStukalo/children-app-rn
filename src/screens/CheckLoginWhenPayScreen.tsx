import React, { useEffect } from "react";
import {
	Dimensions,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Linking,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import { MainStackParamList } from "../navigation/types";
import i18n from '../../localization/i18n';

const { width } = Dimensions.get("window");
const videoContainerWidth = width - 16;
type Props = StackScreenProps<MainStackParamList, "CheckLoginWhenPayScreen">;

const getLocalizedValue = <T extends Record<string, any>>(
	obj: T,
	lang: string,
	fallback: keyof T = "ru" as keyof T
): string => {
	return obj[lang as keyof T] || obj[fallback];
};

export default function CheckLoginWhenPayScreen({ route, navigation }: Props) {
	const { courseId, showAllAccess } = route.params;

	// useEffect(() => {
	// 	if (lesson) {
	// 		navigation.setOptions({
	// 			title:
	// 				lesson.title[currentLanguage as keyof typeof lesson.title] ||
	// 				lesson.title["ru"],
	// 		});
	// 	}
	// }, [lessonId, currentLanguage]);

	const handleToPayment = () => {
		navigation.navigate("LoginScreen", {
			courseId: courseId,
			redirectTo: "PaymentScreen",
			showAllAccess: showAllAccess,
		});
	};

	// if (!course || !lesson) {
	// 	return (
	// 		<SafeAreaView style={styles.loaderContainer}>
	// 			<Text style={{ fontSize: 16, padding: 20 }}>Урок не найден</Text>
	// 		</SafeAreaView>
	// 	);
	// }

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={styles.videoContainer}>
					<Text style={styles.videoTitle}>
						{getLocalizedValue(
							{
								ru: "Подписка",
								en: "Subscription",
							},
							i18n.language
						)}
					</Text>
					<View style={styles.paymentButtonSection}>
						<TouchableOpacity
							style={styles.paymentButton}
							onPress={handleToPayment}
							activeOpacity={0.8}
						>
							<View style={styles.button}>
								<Ionicons
									name='logo-paypal'
									size={24}
									color='#fff'
								/>
								<Text style={styles.buttonText}>
									{getLocalizedValue(
										{
											ru: "Оплатить",
											en: "Pay",
										},
										i18n.language
									)}
								</Text>
							</View>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#F8FAFC" },
	lockedVideoContainer: {
		justifyContent: "center",
	},
	loaderContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff",
	},
	videoContainer: {
		backgroundColor: "#000",
		aspectRatio: 16 / 9,
		width: videoContainerWidth,
		alignItems: "center",
		marginLeft: 4,
		// marginBottom: 8,
		justifyContent: "center",
	},
	videoTitle: {
		fontSize: 20,
		paddingLeft: 12,
		fontFamily: "Inter-Bold",
		color: "#1F2937",
		marginBottom: 8,
		marginTop: 8,
	},
	paymentButtonSection: { padding: 8 },
	paymentButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 16,
		borderRadius: 12,
	},
	button: { flexDirection: "row", alignItems: "center" },
	buttonText: {
		fontSize: 16,
		// fontFamily: typography.bold,
		color: "#FFFFFF",
		marginLeft: 8,
	},
	videoList: { padding: 4 },
	videoCard: {
		backgroundColor: "#FFFFFF",
		marginBottom: 12,
		borderRadius: 12,
		overflow: "hidden",
	},
	materialsBlock: {
		backgroundColor: "#FFF",
		padding: 16,
		margin: 12,
		borderRadius: 12,
		gap: 12,
	},
	materialsTitle: {
		fontSize: 18,
		// fontFamily: typography.bold,
		marginBottom: 8,
		color: "#1F2937",
	},
	materialsButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#F7543E",
		paddingVertical: 12,
		borderRadius: 8,
	},
	materialsButtonText: {
		color: "#FFF",
		fontSize: 16,
		// fontFamily: typography.bold,
		marginLeft: 8,
	},
	lessonsHeader: {
		backgroundColor: "#FFF",
		paddingVertical: 12,
		paddingHorizontal: 16,
	},
	lessonsBlock: {
		backgroundColor: "#FFF",
		padding: 8,
		margin: 12,
		borderRadius: 12,
	},
	lessonsTitle: {
		fontSize: 18,
		// fontWeight: "bold",
		color: "#1F2937",
	},
	lessonItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 10,
		paddingHorizontal: 12,
		borderRadius: 8,
		backgroundColor: "#F3F4F6",
		marginBottom: 8,
	},
	lessonItemText: {
		fontSize: 16,
		color: "#1F2937",
		marginLeft: 8,
	},
	currentLessonItem: {
		// backgroundColor: "#F7543E",
		opacity: 0.8,
	},
	currentLessonItemText: {
		color: "#FFF",
	},
});
