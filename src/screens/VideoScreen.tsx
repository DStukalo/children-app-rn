import React, { useEffect, useState, useCallback, useRef } from "react";
import {
	Dimensions,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	View,
	ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import coursesData from "../../data/data.json";
import { useTranslation } from "react-i18next";
import CustomVideoPlayer from "../components/CustomVideoPlayer";

const { width } = Dimensions.get("window");

// Define the YouTube video data interface
interface YouTubeVideo {
	id: string;
	snippet: {
		title: string;
		description: string;
		localized: {
			title: string;
			description: string;
		};
	};
	statistics: {
		viewCount: string;
		likeCount: string;
	};
}

const API_KEY = "AIzaSyD2TDWxceml-9H3l2yA-R0AQn2Ifd4IwGY"; // YouTube API key

export default function VideoScreen() {
	const route = useRoute<any>();
	const navigation = useNavigation<any>();

	const { id, courseId } = route.params;

	const { i18n } = useTranslation();
	const currentLanguage = i18n.language;

	const course = coursesData.courses.find((c) => c.id === Number(courseId));
	const lesson = course?.details.lessons.find((l) => l.lessonId === Number(id));

	const [fetchedVideoData, setFetchedVideoData] = useState<YouTubeVideo | null>(
		null
	);
	const [loading, setLoading] = useState(true);
	const [isPlaying, setIsPlaying] = useState(false);

	const playerRef = useRef(null);

	// Fetch video data
	useEffect(() => {
		const fetchVideoData = async () => {
			try {
				const response = await axios.get<{ items: YouTubeVideo[] }>(
					`https://www.googleapis.com/youtube/v3/videos`,
					{
						params: {
							part: "snippet,statistics",
							id: id,
							key: API_KEY,
						},
					}
				);

				const video = response.data.items[0];
				setFetchedVideoData(video);
				if (lesson) {
					navigation.setOptions({
						title:
							lesson.title[currentLanguage as keyof typeof lesson.title] ||
							lesson.title["ru"],
					});
				}
			} catch (error) {
				console.error("Error fetching video data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchVideoData();
	}, [id, lesson, navigation, currentLanguage]);

	const onStateChange = useCallback((state: string) => {
		if (state === "ended") {
			setIsPlaying(false);
		}
	}, []);

	if (loading) {
		return (
			<SafeAreaView style={styles.loaderContainer}>
				<ActivityIndicator
					size='large'
					color='#6366F1'
				/>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView showsVerticalScrollIndicator={false}>
				{/* Video Player */}
				<View style={styles.videoContainer}>
					<CustomVideoPlayer
						videoSource={`${
							lesson?.video[
								(currentLanguage as keyof typeof lesson.video) || "ru"
							]
						}`}
					/>
				</View>

				{/* Video Info */}
				{/* <View style={styles.videoInfo}>
					<Text style={styles.videoTitle}>
						{fetchedVideoData?.snippet.localized.title}
					</Text>
					<Text style={styles.videoDescription}>
						{fetchedVideoData?.snippet.localized.description}
					</Text>
					<Text style={styles.videoStats}>
						👀 {fetchedVideoData?.statistics.viewCount} просмотров | 👍{" "}
						{fetchedVideoData?.statistics.likeCount} лайков
					</Text>
				</View> */}
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F8FAFC",
	},
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
	videoInfo: {
		backgroundColor: "#FFFFFF",
		paddingHorizontal: 20,
		paddingVertical: 24,
	},
	videoTitle: {
		fontSize: 20,
		fontFamily: "Inter-Bold",
		color: "#1F2937",
		marginBottom: 8,
	},
	videoDescription: {
		fontSize: 16,
		fontFamily: "Inter-Regular",
		color: "#374151",
		lineHeight: 24,
		marginBottom: 12,
	},
	videoStats: {
		fontSize: 14,
		fontFamily: "Inter-Medium",
		color: "#6B7280",
	},
});
