import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
// import { typography } from "@/styles/typography";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
	RouteProp,
	useFocusEffect,
	useNavigation,
	useRoute,
} from "@react-navigation/native";
import { MainStackParamList } from "../navigation/types";
import {
	findCourseAndStageByCourseId,
	getStages,
	getAllCourses,
	LocalizedString,
} from "../utils/courseData";
import { useAuthCheck } from "../hooks/useAuthCheck";
import {
	getMissingPrerequisiteCourses,
	getStoredUser,
	isCoursePurchased,
	isStagePurchased,
	markCoursePurchased,
	markStagePurchased,
	UserWithPurchases,
} from "../utils/purchaseStorage";
import { formatPrice } from "../utils/price";
import { createPayment } from "../utils/api";

type PaymentScreenNavigationProp = NativeStackNavigationProp<
	MainStackParamList,
	"PaymentScreen"
>;

type PaymentScreenRouteProp = RouteProp<MainStackParamList, "PaymentScreen">;
type Lang = "en" | "ru";

const getLocalized = (value?: LocalizedString, lang: Lang = "en") => {
	if (!value) {
		return "";
	}

	return value[lang] ?? value.ru ?? value.en ?? "";
};

export default function PaymentScreen() {
	const { i18n, t } = useTranslation();
	const navigation = useNavigation<PaymentScreenNavigationProp>();
	const route = useRoute<PaymentScreenRouteProp>();

	const { showAllAccess = true, courseId, stageId } = route.params;

	const parseNumericParam = (value?: number | string) => {
		if (value === undefined || value === null) {
			return undefined;
		}
		const parsed = typeof value === "number" ? value : Number(value);
		return Number.isNaN(parsed) ? undefined : parsed;
	};

	const normalizedCourseId = parseNumericParam(courseId);
	const normalizedStageId = parseNumericParam(stageId);

	const currentLang: Lang = i18n.language === "ru" ? "ru" : "en";

	const courseContext = normalizedCourseId
		? findCourseAndStageByCourseId(normalizedCourseId)
		: undefined;

	const course = courseContext?.course;
	const courseTitle = getLocalized(course?.title, currentLang);

	const stageFromCourse = courseContext?.stage;
	const stageFromParam =
		normalizedStageId !== undefined
			? getStages().find((stageItem) => stageItem.id === normalizedStageId)
			: undefined;
	const stage = stageFromParam ?? stageFromCourse;
	const stageTitle = getLocalized(stage?.title, currentLang);
	const stageSubtitle = getLocalized(stage?.subtitle, currentLang);
	const stageCourseCount = stage?.courses.length ?? 0;

	const { isAuthenticated } = useAuthCheck();
	const [user, setUser] = useState<UserWithPurchases | null>(null);
	const [courseLoading, setCourseLoading] = useState(false);
	const [stageLoading, setStageLoading] = useState(false);

	useFocusEffect(
		useCallback(() => {
			let isActive = true;

			const loadUser = async () => {
				const storedUser = await getStoredUser();
				if (isActive) {
					setUser(storedUser);
				}
			};

			loadUser();

			return () => {
				isActive = false;
			};
		}, [])
	);

	const coursePurchased =
		course && user ? isCoursePurchased(user, course.id) : false;
	const stagePurchased =
		stage && user ? isStagePurchased(user, stage.id) : false;
	const missingPrerequisiteCourses = useMemo(() => {
		if (!course) {
			return [];
		}
		return getMissingPrerequisiteCourses(user, course.id);
	}, [course, user]);
	const hasMissingPrerequisites = missingPrerequisiteCourses.length > 0;
	const nextPrerequisiteCourseTitle = hasMissingPrerequisites
		? getLocalized(missingPrerequisiteCourses[0]?.title, currentLang)
		: "";

	const redirectToAuth = () => {
		navigation.navigate("CheckLoginWhenPayScreen", {
			courseId: normalizedCourseId ? String(normalizedCourseId) : undefined,
			stageId: stage?.id ?? normalizedStageId,
			showAllAccess: true,
		});
	};

	const handleCoursePayment = async () => {
		if (!course || !stage) {
			Alert.alert(t("payment.errorTitle"), t("payment.errorGeneric"));
			return;
		}

		if (!isAuthenticated) {
			redirectToAuth();
			return;
		}

		if (coursePurchased) {
			Alert.alert(
				t("payment.successTitle"),
				t("payment.courseAlreadyPurchased")
			);
			return;
		}

		const missingCourses = getMissingPrerequisiteCourses(user, course.id);

		if (missingCourses.length > 0) {
			const nextCourse = getLocalized(missingCourses[0].title, currentLang);

			Alert.alert(
				t("payment.prerequisiteTitle"),
				t("payment.prerequisiteDescription", { course: nextCourse })
			);
			return;
		}

		try {
			setCourseLoading(true);

			const orderId = `course_${course.id}_${Date.now()}`;
			const description = getLocalized(course.title, currentLang);

			const paymentResponse = await createPayment({
				amount: course.price,
				currency: "BYN",
				description,
				orderId,
				courseId: course.id,
			});

			navigation.navigate("WebPayScreen", {
				paymentUrl: paymentResponse.paymentUrl,
				courseId: course.id,
				amount: course.price,
				description,
			});
		} catch (err: any) {
			console.error("Course payment failed:", err);
			const errorMessage =
				err.response?.data?.message ||
				err.message ||
				t("payment.errorGeneric");
			Alert.alert(t("payment.errorTitle"), errorMessage);
		} finally {
			setCourseLoading(false);
		}
	};

	const handleStagePayment = async () => {
		if (!stage) {
			Alert.alert(t("payment.errorTitle"), t("payment.errorGeneric"));
			return;
		}

		if (!isAuthenticated) {
			redirectToAuth();
			return;
		}

		if (stagePurchased) {
			Alert.alert(
				t("payment.successTitle"),
				t("payment.stageAlreadyPurchased")
			);
			return;
		}

		try {
			setStageLoading(true);

			const orderId = `stage_${stage.id}_${Date.now()}`;
			const description = getLocalized(stage.title, currentLang);

			const paymentResponse = await createPayment({
				amount: stage.price || 0,
				currency: "BYN",
				description,
				orderId,
				stageId: stage.id,
			});

			navigation.navigate("WebPayScreen", {
				paymentUrl: paymentResponse.paymentUrl,
				stageId: stage.id,
				amount: stage.price || 0,
				description,
			});
		} catch (err: any) {
			console.error("Stage payment failed:", err);
			const errorMessage =
				err.response?.data?.message ||
				err.message ||
				t("payment.errorGeneric");
			Alert.alert(t("payment.errorTitle"), errorMessage);
		} finally {
			setStageLoading(false);
		}
	};

	const handleFullAccessPayment = async () => {
		if (!isAuthenticated) {
			redirectToAuth();
			return;
		}

		try {
			setCourseLoading(true);

			const allStages = getStages();
			const allCourses = getAllCourses();

			const totalCoursePrice = allCourses.reduce((sum, course) => sum + (course.price || 0), 0);

			const totalStagePrice = allStages.reduce((sum, stage) => sum + (stage.price || 0), 0);

			const fullAccessPrice = totalCoursePrice || totalStagePrice || 100;

			const orderId = `full_access_${Date.now()}`;
			const description = t("payment.fullDescription") || "Полный доступ ко всем курсам";

			const paymentResponse = await createPayment({
				amount: fullAccessPrice,
				currency: "BYN",
				description,
				orderId,
			});

			navigation.navigate("WebPayScreen", {
				paymentUrl: paymentResponse.paymentUrl,
				amount: fullAccessPrice,
				description,
				isFullAccess: true,
			});
		} catch (err: any) {
			console.error("Full access payment failed:", err);
			const errorMessage =
				err.response?.data?.message ||
				err.message ||
				t("payment.errorGeneric");
			Alert.alert(t("payment.errorTitle"), errorMessage);
		} finally {
			setCourseLoading(false);
		}
	};

	useEffect(() => {
		navigation.setOptions({ title: t("payment.title") });
	}, [navigation, t]);

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView showsVerticalScrollIndicator={false}>
				{/* <Text>{user && JSON.stringify(user, null, 2)}</Text> */}
				{stage && (
					<View style={styles.paymentCard}>
						<View style={styles.paymentHeader}>
							<View style={styles.paymentTitleLine}>
								<View style={styles.paymentIcon}>
									<Ionicons
										name='layers-outline'
										size={24}
										color='#2563EB'
									/>
								</View>
								<Text style={styles.paymentTitle}>
									{t("payment.stageCardTitle")}
								</Text>
							</View>
						</View>

						<Text style={styles.paymentSubTitle}>{stageTitle}</Text>
						{stageSubtitle ? (
							<Text style={styles.stageSubtitleText}>{stageSubtitle}</Text>
						) : null}
						<Text style={styles.paymentDescription}>
							{t("payment.stageDescription", {
								count: stageCourseCount,
							})}
						</Text>
						<Text style={styles.priceLabel}>
							{t("payment.stagePriceLabel", {
								price: formatPrice(stage?.price),
							})}
						</Text>

						{stagePurchased ? (
							<Text style={styles.statusLabel}>
								{t("payment.stageAlreadyPurchased")}
							</Text>
						) : null}

						<View style={styles.paymentButtonSection}>
							<TouchableOpacity
								style={[
									styles.paymentButton,
									{ backgroundColor: "#1D4ED8" },
									(stagePurchased || stageLoading) &&
										styles.paymentButtonDisabled,
								]}
								onPress={handleStagePayment}
								disabled={stagePurchased || stageLoading}
							>
								{stageLoading ? (
									<ActivityIndicator color='#FFFFFF' />
								) : (
									<>
										<Ionicons
											name='layers'
											size={20}
											color='#FFFFFF'
										/>
										<Text style={styles.paymentButtonText}>
											{t("payment.stageButton", {
												price: formatPrice(stage?.price),
											})}
										</Text>
									</>
								)}
							</TouchableOpacity>
						</View>
					</View>
				)}

				{course && (
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
						<Text style={styles.priceLabel}>
							{t("payment.coursePriceLabel", {
								price: formatPrice(course?.price),
							})}
						</Text>

						{coursePurchased ? (
							<Text style={styles.statusLabel}>
								{t("payment.courseAlreadyPurchased")}
							</Text>
						) : null}

						{hasMissingPrerequisites ? (
							<Text style={styles.prerequisiteLabel}>
								{t("payment.prerequisiteDescription", {
									course: nextPrerequisiteCourseTitle,
								})}
							</Text>
						) : null}

						<View style={styles.paymentButtonSection}>
							<TouchableOpacity
								style={[
									styles.paymentButton,
									{ backgroundColor: "#F7543E" },
									(coursePurchased ||
										courseLoading ||
										hasMissingPrerequisites) &&
										styles.paymentButtonDisabled,
								]}
								onPress={handleCoursePayment}
								disabled={
									coursePurchased || courseLoading || hasMissingPrerequisites
								}
							>
								{courseLoading ? (
									<ActivityIndicator color='#FFFFFF' />
								) : (
									<>
										<Ionicons
											name='card'
											size={20}
											color='#FFFFFF'
										/>
										<Text style={styles.paymentButtonText}>
											{t("payment.categoryButtonWithPrice", {
												price: formatPrice(course?.price),
											})}
										</Text>
									</>
								)}
							</TouchableOpacity>
						</View>
					</View>
				)}

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
	stageSubtitleText: {
		fontSize: 14,
		fontFamily: "Nunito-Regular",
		color: "#6B7280",
		textAlign: "center",
		marginBottom: 12,
	},
	priceLabel: {
		fontSize: 15,
		fontFamily: "Nunito-Regular",
		color: "#1F2937",
		textAlign: "center",
		marginBottom: 6,
	},
	statusLabel: {
		fontSize: 14,
		fontFamily: "Nunito-Regular",
		color: "#059669",
		textAlign: "center",
		marginBottom: 12,
	},
	prerequisiteLabel: {
		fontSize: 14,
		fontFamily: "Nunito-Regular",
		color: "#DC2626",
		textAlign: "center",
		marginBottom: 12,
	},
	paymentButtonDisabled: {
		opacity: 0.6,
	},
	paymentButtonText: {
		fontSize: 16,
		// fontFamily: typography.bold,
		fontFamily: "Nunito-Regular",
		color: "#FFFFFF",
		marginLeft: 8,
	},
});
