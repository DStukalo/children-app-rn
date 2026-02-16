import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Slider from "@react-native-community/slider";
import Ionicons from "react-native-vector-icons/Ionicons";
import { VLCPlayer } from "react-native-vlc-media-player";

type Props = {
	videoSource: string;
	onEnd?: () => void;
	onPrev?: () => void;
	onNext?: () => void;
	hasPrev?: boolean;
	hasNext?: boolean;
};

export default function CustomVideoPlayer({
	videoSource,
	onEnd,
	onPrev,
	onNext,
	hasPrev = false,
	hasNext = false,
}: Props) {
	const { t } = useTranslation();
	const playerRef = useRef<any>(null);
	const [paused, setPaused] = useState(false);
	const [currentTimeMs, setCurrentTimeMs] = useState(0);
	const [durationMs, setDurationMs] = useState(0);
	const [positionRatio, setPositionRatio] = useState(0);
	const [isSeeking, setIsSeeking] = useState(false);
	const [sliderWidth, setSliderWidth] = useState(0);

	useEffect(() => {
		setPaused(false);
		setCurrentTimeMs(0);
		setDurationMs(0);
		setPositionRatio(0);
	}, [videoSource]);

	const source = useMemo(() => ({ uri: videoSource }), [videoSource]);

	if (!videoSource) {
		return (
			<View style={styles.contentContainer}>
				<Text>{t("customVideoPlayer.notFound")}</Text>
			</View>
		);
	}

	const seekToMs = (nextMs: number) => {
		const clamped = Math.max(0, Math.min(nextMs, durationMs || 0));
		const ratio = durationMs > 0 ? clamped / durationMs : 0;
		setCurrentTimeMs(clamped);
		setPositionRatio(ratio);
		if (playerRef.current?.seek) playerRef.current.seek(ratio);
		if (playerRef.current?.setNativeProps) {
			playerRef.current.setNativeProps({ seek: ratio });
		}
	};

	const seekToRatio = (ratioValue: number) => {
		const ratio = Math.max(0, Math.min(ratioValue, 1));
		setPositionRatio(ratio);
		if (durationMs > 0) {
			setCurrentTimeMs(durationMs * ratio);
		}
		if (playerRef.current?.seek) playerRef.current.seek(ratio);
		if (playerRef.current?.setNativeProps) {
			playerRef.current.setNativeProps({ seek: ratio });
		}
	};

	return (
		<View style={styles.contentContainer}>
			<View style={styles.videoShell}>
				<VLCPlayer
					ref={playerRef}
					key={videoSource}
					style={styles.video}
					source={source}
					paused={paused}
					autoplay={true}
					repeat={false}
					muted={false}
					volume={100}
					onLoad={(event: any) => {
						if (typeof event?.duration === "number" && event.duration > 0) {
							setDurationMs(event.duration);
						}
					}}
					onProgress={(event: any) => {
						if (typeof event?.duration === "number" && event.duration > 0) {
							setDurationMs(event.duration);
						}
						if (!isSeeking && typeof event?.currentTime === "number") {
							setCurrentTimeMs(event.currentTime);
						}
						if (!isSeeking && typeof event?.position === "number") {
							setPositionRatio(event.position);
						}
					}}
					onEnd={() => {
						setPaused(true);
						setCurrentTimeMs(0);
						setPositionRatio(0);
						onEnd?.();
					}}
				/>
			</View>

			<View style={styles.controlsRow}>
				<TouchableOpacity
					style={[styles.controlButton, !hasPrev ? styles.disabledButton : null]}
					disabled={!hasPrev}
					onPress={onPrev}
				>
					<Ionicons
						name='play-back'
						size={20}
						color={hasPrev ? "#111827" : "#9CA3AF"}
					/>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.controlButton}
					onPress={() => setPaused((prev) => !prev)}
				>
					<Ionicons
						name={paused ? "play" : "pause"}
						size={20}
						color='#111827'
					/>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.controlButton, !hasNext ? styles.disabledButton : null]}
					disabled={!hasNext}
					onPress={onNext}
				>
					<Ionicons
						name='play-forward'
						size={20}
						color={hasNext ? "#111827" : "#9CA3AF"}
					/>
				</TouchableOpacity>
			</View>

			<View
				style={styles.sliderWrap}
				onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
			>
				<Slider
					style={styles.slider}
					minimumValue={0}
					maximumValue={1}
					value={positionRatio}
					minimumTrackTintColor='#F7543E'
					maximumTrackTintColor='#D1D5DB'
					thumbTintColor='#F7543E'
					onSlidingStart={() => setIsSeeking(true)}
					onValueChange={(value) => {
						setPositionRatio(value);
						if (durationMs > 0) setCurrentTimeMs(durationMs * value);
					}}
					onSlidingComplete={(value) => {
						setIsSeeking(false);
						seekToRatio(value);
					}}
				/>
				<Pressable
					style={styles.sliderTapArea}
					onPress={(e) => {
						if (!sliderWidth) return;
						const ratio = e.nativeEvent.locationX / sliderWidth;
						seekToRatio(ratio);
					}}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	contentContainer: {
		width: "100%",
		paddingHorizontal: 4,
	},
	video: {
		width: "100%",
		height: "100%",
	},
	videoShell: {
		width: "100%",
		aspectRatio: 16 / 9,
		backgroundColor: "black",
		borderRadius: 8,
		overflow: "hidden",
	},
	controlsRow: {
		marginTop: 8,
		flexDirection: "row",
		justifyContent: "center",
		gap: 10,
	},
	controlButton: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: "#F3F4F6",
		alignItems: "center",
		justifyContent: "center",
	},
	disabledButton: {
		opacity: 0.5,
	},
	slider: {
		width: "100%",
		height: 28,
	},
	sliderWrap: {
		marginTop: 8,
		width: "100%",
		justifyContent: "center",
	},
	sliderTapArea: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
});
