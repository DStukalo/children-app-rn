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
import { useTranslation } from "react-i18next";
import { StackScreenProps } from "@react-navigation/stack";
import coursesData from "../../data/data.json";
import AudioPlayer from "../components/AudioPlayer";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RootStackParamList } from '../navigation/Stack';

const { width } = Dimensions.get("window");

type Props = StackScreenProps<RootStackParamList, "LessonScreen">;

export default function LessonScreen({ route, navigation }: Props) {
	const { lessonId, courseId } = route.params;

	const { i18n, t } = useTranslation();
	const currentLanguage = i18n.language;

	const course = coursesData.courses.find((c) => c.id === Number(courseId));
	const lesson = course?.details.lessons.find(
		(l) => l.lessonId === Number(lessonId)
	);

	const isLocked = lesson?.access === "locked";

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
		if (isLocked) {
			navigation.navigate("PaymentScreen", {
				showAllAccess: true,
				courseId: String(courseId),
			});
		} else {
			navigation.navigate("VideoScreen", {
				videoId: String(lesson?.lessonId),
				courseId: String(courseId),
			});
		}
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
							const isVideoLocked = lesson.access === "locked";
							return (
								<View
									key={vid.videoId}
									style={styles.videoCard}
								>
									<View style={styles.videoContainer}>
										<Ionicons
											name={isVideoLocked ? "lock-closed" : "play"}
											size={28}
											color='#FFFFFF'
											style={{
												position: "absolute",
												alignSelf: "center",
												top: "40%",
											}}
										/>
									</View>
									<Text style={styles.videoTitle}>
										{vid.title[currentLanguage as keyof typeof vid.title] ||
											vid.title["ru"]}
									</Text>
									<View style={styles.paymentButtonSection}>
										<TouchableOpacity
											style={[
												styles.paymentButton,
												{ backgroundColor: "#F7543E" },
											]}
											onPress={handleToPayment}
										>
											{isLocked ? (
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
											) : (
												<View style={styles.button}>
													<Ionicons
														name='play'
														size={20}
														color='#FFFFFF'
													/>
													<Text style={styles.buttonText}>
														{t("lesson.video")}
													</Text>
												</View>
											)}
										</TouchableOpacity>
									</View>
								</View>
							);
						})}
					</View>
				) : (
					lesson.video && (
						<View style={styles.videoList}>
							<View style={styles.videoCard}>
								<View style={styles.videoContainer}>
									<Ionicons
										name={lesson.access === "locked" ? "lock-closed" : "play"}
										size={28}
										color='#FFFFFF'
										style={{
											position: "absolute",
											alignSelf: "center",
											top: "40%",
										}}
									/>
								</View>
								<Text style={styles.videoTitle}>
									{lesson.title[currentLanguage as keyof typeof lesson.title] ||
										lesson.title["ru"]}
								</Text>
								<View style={styles.paymentButtonSection}>
									<TouchableOpacity
										style={[
											styles.paymentButton,
											{ backgroundColor: "#F7543E" },
										]}
										onPress={handleToPayment}
									>
										{isLocked ? (
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
										) : (
											<View style={styles.button}>
												<Ionicons
													name='play'
													size={20}
													color='#FFFFFF'
												/>
												<Text style={styles.buttonText}>
													{t("lesson.video")}
												</Text>
											</View>
										)}
									</TouchableOpacity>
								</View>
							</View>
						</View>
					)
				)}

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
					Array.isArray(lesson.materials[currentLanguage as "en-US" | "ru"]) &&
					lesson.materials[currentLanguage as "en-US" | "ru"].length > 0 && (
						<View style={styles.materialsBlock}>
							<Text style={styles.materialsTitle}>{t("lesson.materials")}</Text>

							{lesson.materials[currentLanguage as "en-US" | "ru"].map(
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
	container: { flex: 1, backgroundColor: "#F8FAFC" },
	loaderContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff",
	},
	videoContainer: {
		backgroundColor: "#000000",
		aspectRatio: 16 / 9,
		width: width,
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
	videoList: { padding: 12 },
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
});
