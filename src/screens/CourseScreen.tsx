import React, { useEffect } from "react";
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
import coursesData from "../../data/data.json";
import CustomVideoPlayer from "../components/CustomVideoPlayer";

import { useNavigation, useRoute } from "@react-navigation/native";

export default function Course() {
	const route = useRoute<any>();
	const navigation = useNavigation<any>();

	const { id } = route.params; // отримуємо id з params
	const numericId = parseInt(id, 10);

	const course = coursesData.courses.find((c) => c.id === numericId);

	const { i18n, t } = useTranslation();
	const currentLanguage = i18n.language;

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
		// if (isLocked) {
		//   navigation.navigate("Payment", { courseId, showAllAccess: true });
		// } else {
		navigation.navigate("LessonScreen", { lessonId, courseId });
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
						course.details.description["en-US"]) && (
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
					<Text style={styles.sectionTitle}>{t("course.lessons")}</Text>

					{course.details.lessons.map((lesson, index) => {
						const isLocked = lesson.access === "locked";

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

								{isLocked && (
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
						course.details.materials[currentLanguage as "en-US" | "ru"]
					) &&
					course.details.materials[currentLanguage as "en-US" | "ru"].length >
						0 && (
						<View style={styles.materialsBlock}>
							<Text style={styles.materialsTitle}>{t("lesson.materials")}</Text>

							{course.details.materials[currentLanguage as "en-US" | "ru"]?.map(
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
});
