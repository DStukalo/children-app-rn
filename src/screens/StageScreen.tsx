import React, { useCallback, useLayoutEffect, useMemo, useState } from "react";
import {
	Image,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import {
	RouteProp,
	useRoute,
	useNavigation,
	useFocusEffect,
} from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { getStages } from "../utils/courseData";
import { MainStackParamList } from "../navigation/types";
import {
	getStoredUser,
	isCoursePurchased,
	isStagePurchased,
	UserWithPurchases,
	persistUserLocally,
} from "../utils/purchaseStorage";
import { formatPrice, calculateRemainingStagePrice } from "../utils/price";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchCurrentUser } from "../services/userService";

export default function StageScreen() {
	const route = useRoute<RouteProp<MainStackParamList, "StageScreen">>();
	const navigation = useNavigation<any>();
	const { i18n, t } = useTranslation();
	const currentLanguage = i18n.language === "ru" ? "ru" : "en";
	const [user, setUser] = useState<UserWithPurchases | null>(null);
	const stageId = route.params?.stageId;

	const stage = useMemo(() => {
		const id = route.params?.stageId;
		return getStages().find((item) => item.id === id);
	}, [stageId]);

	useFocusEffect(
		useCallback(() => {
			let isActive = true;

			const loadUser = async () => {
				try {
					// First check if user is authenticated
					const token = await AsyncStorage.getItem("auth_token");
					if (!token) {
						// No token - clear user data
						if (isActive) {
							setUser(null);
						}
						return;
					}
					
					// Try to load from server
					try {
						const serverUser = await fetchCurrentUser();
						if (isActive) {
							setUser(serverUser);
							await persistUserLocally(serverUser);
						}
					} catch (serverErr) {
						console.error("Failed to load from server:", serverErr);
						// If server fails, try local cache as fallback
						const storedUser = await getStoredUser();
						if (isActive) {
							setUser(storedUser);
						}
					}
				} catch (err) {
					console.error("Failed to load user:", err);
					if (isActive) {
						setUser(null);
					}
				}
			};

			loadUser();

			return () => {
				isActive = false;
			};
		}, [])
	);

	useLayoutEffect(() => {
		if (stage) {
			const localizedTitle =
				stage.title[currentLanguage as keyof typeof stage.title] ||
				stage.title.ru ||
				stage.title.en;
			navigation.setOptions({ title: localizedTitle });
		}
	}, [navigation, stage, currentLanguage]);

	if (!stage) {
		return (
			<SafeAreaView style={styles.centeredContainer}>
				<Text style={styles.emptyText}>{t("stageScreen.notFound")}</Text>
			</SafeAreaView>
		);
	}

	const handleCoursePress = (courseId: number) => {
		navigation.navigate("CourseScreen", { id: courseId });
	};

	const handleStagePurchase = () => {
		if (!stage) return;
		navigation.navigate("PaymentScreen", {
			stageId: stage.id,
			showAllAccess: false,
		});
	};

	const handleCoursePurchase = (courseId: number) => {
		if (!stage) return;
		navigation.navigate("PaymentScreen", {
			courseId,
			stageId: stage.id,
			showAllAccess: false,
		});
	};

	const stageTitle =
		stage.title[currentLanguage as keyof typeof stage.title] ||
		stage.title.ru ||
		stage.title.en;

	const stageSubtitle =
		stage.subtitle[currentLanguage as keyof typeof stage.subtitle] ||
		stage.subtitle.ru ||
		stage.subtitle.en;

	const purchasedCourseIds = user?.openCategories ?? [];
	const stagePurchased =
		stage && user ? isStagePurchased(user, stage.id) : false;
	const totalCourses = stage.courses.length;
	const purchasedCourses =
		stage && user
			? stage.courses.filter((course) => isCoursePurchased(user, course.id))
					.length
			: 0;
	
	// Calculate dynamic stage price based on remaining courses
	const stagePrice = calculateRemainingStagePrice(stage.courses, purchasedCourseIds);
	const allCoursesPurchased = purchasedCourses === totalCourses;

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={styles.header}>
					<Text style={styles.stageLabel}>{t("stageScreen.stageLabel")}</Text>
					<Text style={styles.stageTitle}>{stageTitle}</Text>
					{stageSubtitle ? (
						<Text style={styles.stageSubtitle}>{stageSubtitle}</Text>
					) : null}

					<View style={styles.stageMetaRow}>
						<Text style={styles.stageMetaText}>
							{t("stageScreen.stagePriceLabel", {
								price: formatPrice(stagePrice),
							})}
						</Text>
						<Text style={styles.stageMetaText}>
							{t("stageScreen.stageProgress", {
								purchased: purchasedCourses,
								total: totalCourses,
							})}
						</Text>
					</View>

					{!allCoursesPurchased && (
						<TouchableOpacity
							style={[
								styles.stagePurchaseButton,
								stagePurchased && styles.disabledButton,
							]}
							onPress={handleStagePurchase}
							disabled={stagePurchased}
						>
							<Text style={styles.stagePurchaseButtonText}>
								{stagePurchased
									? t("stageScreen.stagePurchasedLabel")
									: t("stageScreen.buyStageButton", {
											price: formatPrice(stagePrice),
									  })}
							</Text>
						</TouchableOpacity>
					)}
				</View>

				<Text style={styles.sectionTitle}>{t("stageScreen.coursesTitle")}</Text>

				<View style={styles.courseList}>
					{stage.courses.map((course) => {
						const isPurchased = user
							? isCoursePurchased(user, course.id)
							: false;

						return (
							<TouchableOpacity
								key={course.id}
								style={styles.courseCard}
								onPress={() => handleCoursePress(course.id)}
								activeOpacity={0.85}
							>
								<View style={styles.courseImageContainer}>
									{course.image ? (
										<Image
											source={{ uri: course.image }}
											style={styles.courseImage}
											resizeMode='cover'
										/>
									) : (
										<View style={styles.placeholder}>
											<Text style={styles.placeholderText}>
												{t("stageScreen.noImage")}
											</Text>
										</View>
									)}
								</View>
								<View style={styles.courseContent}>
									<Text style={styles.courseTitle}>
										{course.title[currentLanguage] || course.title.ru}
									</Text>
									{/* <Text style={styles.courseSubtitle}>
										{course.subtitle[currentLanguage] || course.subtitle.ru}
									</Text> */}
									<View style={styles.courseMetaRow}>
										<Text style={styles.coursePrice}>
											{t("stageScreen.coursePriceLabel", {
												price: formatPrice(course.price),
											})}
										</Text>
										<Text
											style={[
												styles.statusBadge,
												isPurchased
													? styles.statusBadgePurchased
													: styles.statusBadgeLocked,
											]}
										>
											{isPurchased
												? t("stageScreen.coursePurchasedLabel")
												: t("stageScreen.courseLockedLabel")}
										</Text>
									</View>
									{!isPurchased && (
										<TouchableOpacity
											style={styles.courseBuyButton}
											onPress={() => handleCoursePurchase(course.id)}
										>
											<Text style={styles.courseBuyButtonText}>
												{t("stageScreen.courseBuyButton", {
													price: formatPrice(course.price),
												})}
											</Text>
										</TouchableOpacity>
									)}
								</View>
							</TouchableOpacity>
						);
					})}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F8FAFC",
	},
	centeredContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#F8FAFC",
		padding: 24,
	},
	emptyText: {
		fontSize: 16,
		color: "#6B7280",
		textAlign: "center",
	},
	header: {
		paddingHorizontal: 20,
		paddingTop: 32,
		paddingBottom: 16,
		backgroundColor: "#FFFFFF",
	},
	stageLabel: {
		fontSize: 14,
		color: "#6B7280",
		marginBottom: 4,
		fontFamily: "Inter-Medium",
	},
	stageTitle: {
		fontSize: 24,
		fontFamily: "Inter-Bold",
		color: "#111827",
		lineHeight: 30,
	},
	stageSubtitle: {
		marginTop: 8,
		fontSize: 16,
		color: "#4B5563",
		fontFamily: "Inter-Regular",
		marginBottom: 12,
	},
	stageMetaRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
	},
	stageMetaText: {
		fontSize: 14,
		fontFamily: "Inter-Medium",
		color: "#4B5563",
	},
	stagePurchaseButton: {
		backgroundColor: "#F7543E",
		borderRadius: 12,
		paddingVertical: 12,
		alignItems: "center",
		justifyContent: "center",
	},
	stagePurchaseButtonText: {
		color: "#FFFFFF",
		fontFamily: "Inter-SemiBold",
		fontSize: 16,
	},
	sectionTitle: {
		paddingHorizontal: 20,
		paddingVertical: 16,
		fontSize: 18,
		fontFamily: "Inter-SemiBold",
		color: "#1F2937",
	},
	courseList: {
		paddingHorizontal: 20,
		paddingBottom: 24,
		gap: 16,
	},
	courseCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: 16,
		overflow: "hidden",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.08,
		shadowRadius: 6,
		elevation: 3,
	},
	courseImageContainer: {
		width: "100%",
		height: 180,
		backgroundColor: "#E5E7EB",
	},
	courseImage: {
		width: "100%",
		height: "100%",
	},
	placeholder: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#E5E7EB",
	},
	placeholderText: {
		color: "#6B7280",
		fontSize: 14,
		fontFamily: "Inter-Medium",
	},
	courseContent: {
		paddingHorizontal: 16,
		paddingVertical: 14,
		gap: 6,
	},
	courseMetaRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginTop: 6,
	},
	coursePrice: {
		fontSize: 14,
		fontFamily: "Inter-Medium",
		color: "#1F2937",
	},
	statusBadge: {
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 999,
		fontSize: 12,
		fontFamily: "Inter-SemiBold",
		textTransform: "uppercase",
	},
	statusBadgePurchased: {
		backgroundColor: "#DCFCE7",
		color: "#15803D",
	},
	statusBadgeLocked: {
		backgroundColor: "#FEE2E2",
		color: "#B91C1C",
	},
	courseBuyButton: {
		marginTop: 10,
		backgroundColor: "#F7543E",
		borderRadius: 10,
		paddingVertical: 10,
		alignItems: "center",
	},
	courseBuyButtonText: {
		color: "#FFFFFF",
		fontFamily: "Inter-Medium",
		fontSize: 14,
	},
	disabledButton: {
		opacity: 0.65,
	},
	courseTitle: {
		fontSize: 18,
		fontFamily: "Inter-SemiBold",
		color: "#111827",
	},
	courseSubtitle: {
		fontSize: 14,
		fontFamily: "Inter-Regular",
		color: "#4B5563",
	},
	courseAction: {
		marginTop: 4,
		fontSize: 14,
		fontFamily: "Inter-SemiBold",
		color: "#F7543E",
	},
});
