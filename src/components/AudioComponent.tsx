import { StyleSheet, Text, View } from "react-native";
import { Lesson } from "../types/types";
import AudioPlayer from "./AudioPlayer";

type Props = {
	lesson: Lesson;
};

export default function AudioConmponent({ lesson }: Props) {
	return (
		<>
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
										track.audio[currentLanguage as keyof typeof track.audio] ||
										track.audio["ru"]
									}
								/>
							</View>
						))}
					</View>
				)}
		</>
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
	},
	currentLessonItemText: {
		color: "#FFF",
	},
});
