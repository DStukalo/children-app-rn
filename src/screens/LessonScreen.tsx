import React, { useEffect, useState } from "react";
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
import { useTranslation } from "react-i18next";
import { StackScreenProps } from "@react-navigation/stack";
import AudioPlayer from "../components/AudioPlayer";
import Ionicons from "react-native-vector-icons/Ionicons";
import { MainStackParamList } from "../navigation/types";
import { Dropdown } from "../components/Dropdown";
import CustomVideoPlayer from "../components/CustomVideoPlayer";
import { useAuthCheck } from "../hooks/useAuthCheck";
import { useIsPremiumUser } from "../hooks/useIsPremiumUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserData } from "../types/types";
import { findCourseById } from "../utils/courseData";

const { width } = Dimensions.get("window");
const videoContainerWidth = width - 16;
type Props = StackScreenProps<MainStackParamList, "LessonScreen">;

const getLocalizedValue = <T extends Record<string, any>>(
	obj: T,
	lang: string,
	fallback: keyof T = "ru" as keyof T
): string => {
	return obj[lang as keyof T] || obj[fallback];
};

export default function LessonScreen({ route, navigation }: Props) {
	const { lessonId, courseId } = route.params;
	const { i18n, t } = useTranslation();
	const currentLanguage = i18n.language;

	const { isAuthenticated } = useAuthCheck();
	const isPremiumUser = useIsPremiumUser();

	const course = findCourseById(courseId);
	const lesson = course?.details.lessons?.find((l) => l.lessonId === lessonId);
	const [user, setUser] = useState<UserData | null>(null);

	useEffect(() => {
		const loadUser = async () => {
			const jsonValue = await AsyncStorage.getItem("user_data");
			if (jsonValue) {
				setUser(JSON.parse(jsonValue));
			}
		};
		loadUser();
	}, []);

	const hasPartialPremiumAccess =
		user?.role === "User with party premium access" &&
		Array.isArray(user.openCategories) &&
		course?.id !== undefined &&
		user.openCategories.includes(course?.id);

	const isLocked =
		lesson?.access === "locked" && !isPremiumUser && !hasPartialPremiumAccess;

	useEffect(() => {
		if (lesson) {
			navigation.setOptions({
				title:
					lesson.title[currentLanguage as keyof typeof lesson.title] ||
					lesson.title["ru"],
			});
		}
	}, [lessonId, currentLanguage]);

	const handleToPayment = () => {
		// if (!isAuthenticated) {
		// 	navigation.navigate("CheckLoginWhenPayScreen", {
		// 		courseId: courseId,
		// 		showAllAccess: true,
		// 	});
		// } else {
		navigation.navigate("PaymentScreen", {
			courseId: String(courseId),
			showAllAccess: true,
		});
		// }
	};

	if (!course || !lesson) {
		return (
			<SafeAreaView style={styles.loaderContainer}>
				<Text style={{ fontSize: 16, padding: 20 }}>Урок не найден</Text>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView showsVerticalScrollIndicator={false}>
				{Array.isArray(lesson.video) ? (
					<View style={styles.videoList}>
						{lesson.video.map((vid) => {
							const isVideoLocked =
								lesson.access === "locked" &&
								!isPremiumUser &&
								!hasPartialPremiumAccess;
							return (
								<View key={vid.videoId}>
									{isVideoLocked ? (
										<View style={styles.lockedVideoContainer}>
											<View style={styles.videoContainer}>
												<Ionicons
													name='lock-closed'
													size={20}
													color='#9CA3AF'
													style={{ marginLeft: 8 }}
												/>
											</View>
											<View style={styles.paymentButtonSection}>
												<TouchableOpacity
													style={[
														styles.paymentButton,
														{ backgroundColor: "#F7543E" },
													]}
													onPress={handleToPayment}
												>
													<View style={styles.button}>
														<Ionicons
															name='card'
															size={20}
															color='#FFFFFF'
														/>
														<Text style={styles.buttonText}>
															{t("lesson.toPayment")}
														</Text>
													</View>
												</TouchableOpacity>
											</View>
										</View>
									) : (
										<View style={{ aspectRatio: 16 / 9 }}>
											<CustomVideoPlayer
												videoSource={getLocalizedValue(
													vid.video,
													currentLanguage,
													"ru"
												)}
											/>
										</View>
									)}
								</View>
							);
						})}
					</View>
				) : lesson.video ? (
					<View style={styles.videoList}>
						{isLocked ? (
							<View style={styles.lockedVideoContainer}>
								<View style={styles.videoContainer}>
									<Ionicons
										name='lock-closed'
										size={20}
										color='#9CA3AF'
										style={{ marginLeft: 8 }}
									/>
								</View>
								<View style={styles.paymentButtonSection}>
									<TouchableOpacity
										style={[
											styles.paymentButton,
											{ backgroundColor: "#F7543E" },
										]}
										onPress={handleToPayment}
									>
										<View style={styles.button}>
											<Ionicons
												name='card'
												size={20}
												color='#FFFFFF'
											/>
											<Text style={styles.buttonText}>
												{t("lesson.toPayment")}
											</Text>
										</View>
									</TouchableOpacity>
								</View>
							</View>
						) : (
							<View style={{ aspectRatio: 16 / 9 }}>
								<CustomVideoPlayer
									videoSource={`${
										lesson?.video[
											(currentLanguage as keyof typeof lesson.video) || "ru"
										]
									}`}
								/>
							</View>
						)}
					</View>
				) : null}

				{"audio" in lesson &&
					Array.isArray(lesson.audio) &&
					lesson.audio.length > 0 && (
						<View style={styles.materialsBlock}>
							{lesson.audio.map((track) => (
								<View
									key={track.audioId}
									style={{ marginBottom: 16 }}
								>
									<Text style={{ fontSize: 16, marginBottom: 6 }}>
										{track.title[currentLanguage as keyof typeof track.title] ||
											track.title["ru"]}
									</Text>
									<AudioPlayer
										source={
											track.audio[
												currentLanguage as keyof typeof track.audio
											] || track.audio["ru"]
										}
									/>
								</View>
							))}
						</View>
					)}

				{"materials" in lesson &&
					lesson.materials &&
					Array.isArray(
						lesson.materials[(currentLanguage as "en" | "ru") || "ru"]
					) &&
					lesson.materials[(currentLanguage as "en" | "ru") || "ru"].length >
						0 && (
						<View style={styles.materialsBlock}>
							<Text style={styles.materialsTitle}>{t("lesson.materials")}</Text>

							{lesson.materials[(currentLanguage as "en" | "ru") || "ru"].map(
								(url, idx) => (
									<TouchableOpacity
										key={idx}
										style={styles.materialsButton}
										onPress={() => {
											if (url) {
												Linking.openURL(url).catch((err) =>
													console.error("Failed to open URL:", err)
												);
											}
										}}
									>
										<Ionicons
											name='download'
											size={20}
											color='#FFF'
										/>
										<Text style={styles.materialsButtonText}>
											{t("lesson.downloadMaterials")} {idx + 1}
										</Text>
									</TouchableOpacity>
								)
							)}
						</View>
					)}

				<View style={styles.lessonsBlock}>
					<Dropdown
						item={{ title: t("lesson.otherLessons") }}
						initiallyOpen={true}
						renderLabel={() => (
							<View style={styles.lessonsHeader}>
								<Text style={styles.lessonsTitle}>
									{t("lesson.otherLessons")}
								</Text>
							</View>
						)}
						renderContent={() =>
							course.details.lessons?.map((l) => {
								const isCurrent = l.lessonId === Number(lessonId);

								return (
									<TouchableOpacity
										key={l.lessonId}
										disabled={isCurrent}
										onPress={() => {
											if (!isCurrent) {
												navigation.navigate("LessonScreen", {
													lessonId: l.lessonId,
													courseId: courseId,
												});
											}
										}}
										style={[
											styles.lessonItem,
											// isCurrent && styles.currentLessonItem,
										]}
									>
										<Ionicons
											name={isCurrent ? "book" : "play-outline"}
											size={20}
											color={isCurrent ? "#F7543E" : "#1F2937"}
										/>
										<Text
											style={[
												styles.lessonItemText,
												isCurrent && styles.currentLessonItemText,
											]}
										>
											{l.title[currentLanguage as keyof typeof l.title] ||
												l.title["ru"]}
										</Text>
									</TouchableOpacity>
								);
							})
						}
					/>
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
		backgroundColor: "#F7543E",
		borderBottomColor: "#F7543E",
		// opacity: 0.8,
	},
	currentLessonItemText: {
		color: "#F7543E",
		// textDecorationLine: "underline",
		// textDecorationColor: "#F7543E",
	},
});
