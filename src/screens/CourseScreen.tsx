import React, { useEffect, useState } from "react";
import {
	Image,
	Linking,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { useTranslation } from "react-i18next";
import Ionicons from "react-native-vector-icons/Ionicons";
import CustomVideoPlayer from "../components/CustomVideoPlayer";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useAuthCheck } from "../hooks/useAuthCheck";
import { useIsPremiumUser } from "../hooks/useIsPremiumUser";
import { UserData } from "../types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AudioPlayer from "../components/AudioPlayer";
import { findCourseById } from "../utils/courseData";
import { MainStackParamList } from "../navigation/types";

export default function Course() {
	const route = useRoute<RouteProp<MainStackParamList, "CourseScreen">>();
	const navigation = useNavigation<any>();
	const { id } = route.params;
	const course = findCourseById(id);

	const { i18n, t } = useTranslation();
	const currentLanguage = i18n.language;

	const { isAuthenticated } = useAuthCheck();
	const isPremiumUser = useIsPremiumUser();

	const [user, setUser] = useState<UserData | null>(null);

	const [currentIndex, setCurrentIndex] = useState(0);
	const handleNext = (index: number) => {
		const audios = course?.details?.audio;
		if (!audios || index >= audios.length - 1) return;
		setCurrentIndex(index + 1);
	};

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

	useEffect(() => {
		if (course) {
			navigation.setOptions({
				title:
					course.title[currentLanguage as keyof typeof course.title] ||
					course.title["ru"],
			});
		}
	}, [id, currentLanguage]);

	if (!course) {
		return (
			<SafeAreaView style={styles.container}>
				<Text style={{ padding: 20, fontSize: 16 }}>
					Курс не найден для id: {id}
				</Text>
			</SafeAreaView>
		);
	}

	const handleLessonPress = (
		lessonId: number,
		isLocked: boolean,
		courseId: number
	) => {
		if (isPremiumUser || !isLocked) {
			navigation.navigate("LessonScreen", { lessonId, courseId });
			return;
		}

		if (isLocked) {
			// navigation.navigate("PaymentScreen", {
			// 	courseId: courseId,
			// 	showAllAccess: false,
			// });
			// if (!isAuthenticated) {
			// 	navigation.navigate("CheckLoginWhenPayScreen", {
			// 		courseId: courseId,
			// 		showAllAccess: true,
			// 	});
			// } else {
			navigation.navigate("PaymentScreen", {
				courseId: courseId,
				showAllAccess: true,
			});
			// }
		}
		// else {
		// 	navigation.navigate("LessonScreen", { lessonId, courseId });
		// }
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={styles.courseImageContainer}>
					{course.details.video?.[
						currentLanguage as keyof typeof course.details.video
					] ? (
						<CustomVideoPlayer
							videoSource={
								course.details.video[
									currentLanguage as keyof typeof course.details.video
								] || course.details.video["ru"]
							}
						/>
					) : (
						<Image
							source={{ uri: course.image }}
							style={styles.courseImage}
						/>
					)}
				</View>

				<View style={styles.courseInfo}>
					{(course.details.description["ru"].length > 0 ||
						course.details.description["en"]) && (
						<Text style={styles.courseDescription}>
							{course.details.description[
								currentLanguage as keyof typeof course.details.description
							] || course.details.description["ru"]}
						</Text>
					)}

					<Text style={styles.courseSubtitle}>
						{course.subtitle[currentLanguage as keyof typeof course.subtitle] ||
							course.subtitle["ru"]}
					</Text>
				</View>

				<View style={styles.lessonsSection}>
					{course.details.lessons && (
						<Text style={styles.sectionTitle}>{t("course.lessons")}</Text>
					)}

					{course.details.lessons?.map((lesson, index) => {
						const isLocked =
							lesson?.access === "locked" &&
							!isPremiumUser &&
							!hasPartialPremiumAccess;

						return (
							<TouchableOpacity
								key={lesson.lessonId}
								style={styles.lessonCard}
								onPress={() =>
									handleLessonPress(lesson.lessonId, isLocked, course.id)
								}
								activeOpacity={0.7}
							>
								<View style={styles.lessonNumber}>
									<Text style={styles.lessonNumberText}>{index + 1}</Text>
								</View>

								<View style={styles.lessonContent}>
									<Text style={styles.lessonTitle}>
										{lesson.title[
											currentLanguage as keyof typeof lesson.title
										] || lesson.title["ru"]}
									</Text>
								</View>

								{isLocked && !isPremiumUser && (
									<Ionicons
										name='lock-closed'
										size={20}
										color='#9CA3AF'
										style={{ marginLeft: 8 }}
									/>
								)}
							</TouchableOpacity>
						);
					})}
				</View>

				{course?.details?.materials &&
					Array.isArray(
						course.details.materials[currentLanguage as "en" | "ru"]
					) &&
					course.details.materials[currentLanguage as "en" | "ru"].length >
						0 && (
						<View style={styles.materialsBlock}>
							<Text style={styles.materialsTitle}>{t("course.materials")}</Text>

							{course.details.materials[currentLanguage as "en" | "ru"]?.map(
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

				{course?.details?.audio && course.details.audio.length > 0 && (
					<View style={styles.audioSection}>
						<Text style={styles.sectionTitle}>{t("course.audioLessons")}</Text>

						{course.details.audio.map((item, index) => (
							<View
								key={item.audioId}
								style={{ marginBottom: 16 }}
							>
								<Text style={{ fontSize: 16, marginBottom: 6 }}>
									{item.title[currentLanguage as keyof typeof item.title] ||
										item.title["ru"]}
								</Text>
								<AudioPlayer
									source={
										item.audio[currentLanguage as keyof typeof item.audio] ||
										item.audio["ru"]
									}
									autoPlay={index === currentIndex}
									onEnd={() => handleNext(index)}
									isPlayingFromCourse={index === currentIndex}
								/>
							</View>
						))}
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
	courseImageContainer: {
		position: "relative",
		height: 200,
		overflow: "hidden",
	},
	courseImage: {
		width: "100%",
		height: "100%",
		resizeMode: "cover",
	},
	courseInfo: {
		backgroundColor: "#FFFFFF",
		borderBottomWidth: 1,
		borderBottomColor: "#E5E7EB",
	},
	courseDescription: {
		fontSize: 16,
		paddingHorizontal: 10,
		paddingVertical: 24,
		fontFamily: "Inter-Regular",
		color: "#374151",
		lineHeight: 24,
		marginBottom: 8,
	},
	courseSubtitle: {
		fontSize: 14,
		paddingHorizontal: 10,
		paddingVertical: 24,
		fontFamily: "Inter-Regular",
		color: "#6B7280",
		lineHeight: 20,
	},
	lessonsSection: {
		backgroundColor: "#FFFFFF",
		paddingHorizontal: 20,
		paddingVertical: 24,
	},
	sectionTitle: {
		fontSize: 18,
		fontFamily: "Inter-SemiBold",
		color: "#1F2937",
		marginBottom: 16,
	},
	lessonCard: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#F3F4F6",
	},
	lessonNumber: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: "#E5E7EB",
		alignItems: "center",
		justifyContent: "center",
		marginRight: 16,
	},
	lessonNumberText: {
		fontSize: 14,
		fontFamily: "Inter-SemiBold",
		color: "#6B7280",
	},
	lessonContent: {
		flex: 1,
	},
	lessonTitle: {
		fontSize: 16,
		fontFamily: "Inter-Medium",
		color: "#1F2937",
		marginBottom: 4,
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
	audioSection: {
		backgroundColor: "#FFF",
		padding: 16,
		margin: 12,
		borderRadius: 12,
		gap: 12,
	},
	audioTitle: {
		fontSize: 18,
		// fontFamily: typography.bold,
		marginBottom: 8,
		color: "#1F2937",
	},
});
