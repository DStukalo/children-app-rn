import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, Button, Text } from "react-native";
import Video, { OnLoadData, OnProgressData } from "react-native-video";

export default function CustomVideoPlayer({
	videoSource,
}: {
	videoSource: string;
}) {
	const playerRef = useRef(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [duration, setDuration] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);

	const { i18n, t } = useTranslation();

	const handleLoad = (data: OnLoadData) => {
		setDuration(data.duration);
	};

	const handleProgress = (data: OnProgressData) => {
		setCurrentTime(data.currentTime);
	};

	const togglePlayPause = () => {
		setIsPlaying((prev) => !prev);
	};

	if (!videoSource)
		return (
			<View style={styles.contentContainer}>
				<Text>{t("customVideoPlayer.notFound")}</Text>
			</View>
		);

	return (
		<View style={styles.contentContainer}>
			<Video
				ref={playerRef}
				source={{ uri: videoSource }}
				// source={{ uri: "https://www.w3schools.com/html/mov_bbb.mp4" }}
				style={styles.video}
				resizeMode='cover'
				repeat={true} // loop
				paused={!isPlaying}
				onLoad={handleLoad}
				onProgress={handleProgress}
				controls
			/>
			{/* <View style={styles.controlsContainer}>
				<Button
					title={isPlaying ? "Pause" : "Play"}
					onPress={togglePlayPause}
				/>
			</View> */}

			{/* <Text>{videoSource}</Text> */}
		</View>
	);
}

const styles = StyleSheet.create({
	contentContainer: {
		flex: 1,
		padding: 10,
		alignItems: "center",
		justifyContent: "center",
		marginHorizontal: 10,
	},
	video: {
		width: "100%",
		height: "100%",
		backgroundColor: "black",
	},
	controlsContainer: {
		padding: 10,
	},
});
