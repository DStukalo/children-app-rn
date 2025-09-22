import React, { useRef, useState } from "react";
import { StyleSheet, View, Button } from "react-native";
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

	const handleLoad = (data: OnLoadData) => {
		setDuration(data.duration);
	};

	const handleProgress = (data: OnProgressData) => {
		setCurrentTime(data.currentTime);
	};

	const togglePlayPause = () => {
		setIsPlaying((prev) => !prev);
	};

	return (
		<View style={styles.contentContainer}>
			<Video
				ref={playerRef}
				source={{ uri: videoSource }}
				style={styles.video}
				resizeMode="contain"
				repeat={true} // loop
				paused={!isPlaying} // якщо false → відео відтворюється
				onLoad={handleLoad}
				onProgress={handleProgress}
			/>
			<View style={styles.controlsContainer}>
				<Button
					title={isPlaying ? "Pause" : "Play"}
					onPress={togglePlayPause}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	contentContainer: {
		flex: 1,
		padding: 10,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 50,
	},
	video: {
		width: 350,
		height: 275,
		backgroundColor: "black",
	},
	controlsContainer: {
		padding: 10,
	},
});
