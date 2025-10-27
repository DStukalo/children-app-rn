import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Sound from "react-native-sound";
import Ionicons from "react-native-vector-icons/Ionicons";
import Slider from "@react-native-community/slider";

type Props = {
	source: string;
};

export default function AudioPlayer({ source }: Props) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [duration, setDuration] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);
	const soundRef = useRef<Sound | null>(null);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	useEffect(() => {
		const sound = new Sound(source, undefined, (error) => {
			if (error) {
				console.log("Failed to load sound", error);
				return;
			}
			setDuration(sound.getDuration());
		});

		soundRef.current = sound;

		return () => {
			sound.release();
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [source]);

	const togglePlayPause = () => {
		if (!soundRef.current) return;

		if (isPlaying) {
			soundRef.current.pause();
			setIsPlaying(false);
			if (intervalRef.current) clearInterval(intervalRef.current);
		} else {
			soundRef.current.play(() => {
				setIsPlaying(false);
				setCurrentTime(0);
				if (intervalRef.current) clearInterval(intervalRef.current);
			});
			setIsPlaying(true);

			// update progress
			intervalRef.current = setInterval(() => {
				soundRef.current?.getCurrentTime((time) => setCurrentTime(time));
			}, 500);
		}
	};

	const restart = () => {
		if (!soundRef.current) return;
		soundRef.current.setCurrentTime(0);
		soundRef.current.play();
		setIsPlaying(true);
	};

	const handleSeek = (value: number) => {
		if (!soundRef.current) return;
		soundRef.current.setCurrentTime(value);
		setCurrentTime(value);
	};

	return (
		<View style={styles.container}>
			{/* Play / Pause */}
			<View style={styles.buttonContainer}>
				<TouchableOpacity onPress={togglePlayPause}>
					<Ionicons
						name={isPlaying ? "pause-circle" : "play-circle"}
						size={54}
						color='#F7543E'
					/>
				</TouchableOpacity>

				{/* Restart */}
				<TouchableOpacity onPress={restart}>
					<Ionicons
						name='refresh-circle'
						size={54}
						color='#F7543E'
					/>
				</TouchableOpacity>
			</View>

			{/* Progress bar */}
			<View style={styles.sliderContainer}>
				<Slider
					style={styles.slider}
					minimumValue={0}
					maximumValue={duration}
					value={currentTime}
					minimumTrackTintColor='#F7543E'
					maximumTrackTintColor='#888'
					thumbTintColor='#F7543E'
					onSlidingComplete={handleSeek}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 10,
		padding: 10,
		alignItems: "center",
	},
	buttonContainer: {
		width: "90%",
		marginTop: 0,
		flexDirection: "row",
		justifyContent: "center",
		gap: 20,
	},
	sliderContainer: {
		width: "90%",
		marginTop: 20,
	},
	slider: {
		width: "100%",
		height: 30,
	},
});
