import React, { useEffect } from "react";
import {
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
// import { typography } from "@/styles/typography";
import coursesData from "../../data/data.json";
import { RootStackParamList } from "../navigation/Stack";

type Lang = "en-US" | "ru";

export default function PaymentScreen() {
	const { i18n, t } = useTranslation();
	const navigation = useNavigation();
	const route = useRoute<RouteProp<RootStackParamList, "PaymentScreen">>();

	const { showAllAccess, courseId } = route.params || {};

	const currentLang: Lang = i18n.language === "ru" ? "ru" : "en-US";

	const course = coursesData.courses.find(
		(c) => String(c.id) === String(courseId)
	);
	const courseTitle = course?.title[currentLang] ?? "";

	const handleCategoryPayment = () => {
		// navigation.navigate("AccessCode", { type: "category" });
	};

	const handleFullAccessPayment = () => {
		// navigation.navigate("AccessCode", { type: "full" });
	};

	useEffect(() => {
		navigation.setOptions({ title: t("payment.title") });
	}, [navigation, t]);

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={styles.paymentCard}>
					<View style={styles.paymentHeader}>
						<View style={styles.paymentTitleLine}>
							<View style={styles.paymentIcon}>
								<Ionicons
									name='albums-outline'
									size={24}
									color='#6366F1'
								/>
							</View>
							<Text style={styles.paymentTitle}>
								{t("payment.categoryTitle")}
							</Text>
						</View>
						<Text style={styles.paymentSubTitle}>{courseTitle}</Text>
					</View>

					<Text style={styles.paymentDescription}>
						{t("payment.categoryDescription")}
					</Text>

					<View style={styles.paymentButtonSection}>
						<TouchableOpacity
							style={[styles.paymentButton, { backgroundColor: "#F7543E" }]}
							onPress={handleCategoryPayment}
						>
							<Ionicons
								name='card'
								size={20}
								color='#FFFFFF'
							/>
							<Text style={styles.paymentButtonText}>
								{t("payment.categoryButton")}
							</Text>
						</TouchableOpacity>
					</View>
				</View>

				{showAllAccess !== false && (
					<View style={styles.paymentCard}>
						<View style={styles.paymentHeader}>
							<View style={styles.paymentTitleLine}>
								<View style={styles.paymentIcon}>
									<Ionicons
										name='key-outline'
										size={24}
										color='#10B981'
									/>
								</View>
								<Text style={styles.paymentTitle}>
									{t("payment.fullTitle")}
								</Text>
							</View>
						</View>

						<Text style={styles.paymentDescription}>
							{t("payment.fullDescription")}
						</Text>

						<View style={styles.paymentButtonSection}>
							<TouchableOpacity
								style={[styles.paymentButton, { backgroundColor: "#F7543E" }]}
								onPress={handleFullAccessPayment}
							>
								<Ionicons
									name='key'
									size={20}
									color='#FFFFFF'
								/>
								<Text style={styles.paymentButtonText}>
									{t("payment.fullAccessButton")}
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				)}
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F8FAFC",
	},
	paymentCard: {
		backgroundColor: "#FFFFFF",
		margin: 20,
		borderRadius: 16,
		padding: 24,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 4,
	},
	paymentHeader: {
		flexDirection: "column",
		alignItems: "center",
		marginBottom: 16,
	},
	paymentTitleLine: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	paymentIcon: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#EEF2FF",
		alignItems: "center",
		justifyContent: "center",
		marginRight: 12,
	},
	paymentTitle: {
		fontSize: 18,
		// fontFamily: typography.bold,
		color: "#1F2937",
		flex: 1,
	},
	paymentSubTitle: {
		fontSize: 18,
		// fontFamily: typography.bold,
		fontFamily: "Nunito-Regular",
		color: "#1F2937",
		textDecorationColor: "#F7543E",
		textDecorationLine: "underline",
		flex: 1,
	},
	paymentDescription: {
		fontSize: 16,
		// fontFamily: typography.regular,
		fontFamily: "Nunito-Regular",
		color: "#374151",
		lineHeight: 22,
		marginBottom: 20,
	},
	paymentButtonSection: {
		paddingTop: 8,
	},
	paymentButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 16,
		borderRadius: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 6,
		elevation: 6,
	},
	paymentButtonText: {
		fontSize: 16,
		// fontFamily: typography.bold,
		fontFamily: "Nunito-Regular",
		color: "#FFFFFF",
		marginLeft: 8,
	},
});
