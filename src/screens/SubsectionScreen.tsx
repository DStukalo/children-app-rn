import React, { useEffect, useState } from "react";
import {
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { useTranslation } from "react-i18next";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { MainStackParamList } from "../navigation/types";
import { findSubsectionByPath } from "../utils/sectionsData";
import CustomVideoPlayer from "../components/CustomVideoPlayer";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useIsPremiumUser } from "../hooks/useIsPremiumUser";

type Props = NativeStackScreenProps<MainStackParamList, "SubsectionScreen">;

const capitalizeFirstLetter = (value?: string) => {
	if (!value) return "";
	return value.charAt(0).toUpperCase() + value.slice(1);
};

export default function SubsectionScreen({ route, navigation }: Props) {
	const { t, i18n } = useTranslation();
	const { sectionId, subsectionPath } = route.params;
	const currentLanguage = i18n.language === "ru" ? "ru" : "en";
	const isPremiumUser = useIsPremiumUser();
	const subsection = findSubsectionByPath(sectionId, subsectionPath);
	const [activeVideo, setActiveVideo] = useState<{
		id: string;
		title: string;
		source: string;
	} | null>(null);
	const isSongsSubsection =
		sectionId === "makatop" && subsectionPath[0] === "songs";
	const isLockedItem = (
		item: { access?: "free" | "locked" },
		index: number
	) =>
		(item.access === "locked" || (isSongsSubsection && index > 0)) &&
		!isPremiumUser;
	const playableItems =
		subsection?.items?.filter(
			(item, index) =>
				!!(item.video?.[currentLanguage] || item.video?.ru) &&
				!isLockedItem(item, index)
		) ?? [];
	const activePlayableIndex = playableItems.findIndex(
		(item) => item.id === activeVideo?.id
	);

	const selectPlayableByIndex = (index: number) => {
		if (index < 0 || index >= playableItems.length) return;
		const nextItem = playableItems[index];
		const nextSource = nextItem.video?.[currentLanguage] || nextItem.video?.ru;
		if (!nextSource) return;
		setActiveVideo({
			id: nextItem.id,
			title: capitalizeFirstLetter(
				nextItem.title[currentLanguage] || nextItem.title.ru
			),
			source: nextSource,
		});
	};

	useEffect(() => {
		if (!subsection?.items?.length) {
			setActiveVideo(null);
			return;
		}

		const firstSong = subsection.items.find(
			(item, index) =>
				(item.video?.[currentLanguage] || item.video?.ru) &&
				!isLockedItem(item, index)
		);
		if (!firstSong) {
			setActiveVideo(null);
			return;
		}

		const source = firstSong.video?.[currentLanguage] || firstSong.video?.ru;
		if (!source) {
			setActiveVideo(null);
			return;
		}

		setActiveVideo({
			id: firstSong.id,
			title: capitalizeFirstLetter(
				firstSong.title[currentLanguage] || firstSong.title.ru
			),
			source,
		});
	}, [subsection?.id, currentLanguage, isPremiumUser]);

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView
				contentContainerStyle={styles.content}
				showsVerticalScrollIndicator={false}
			>
				<Text style={styles.title}>
					{subsection?.title?.[currentLanguage] ||
						subsection?.title?.ru ||
						subsectionPath[subsectionPath.length - 1]}
				</Text>

				{subsection?.subsections?.length ? (
					<View style={styles.list}>
						{subsection.subsections.map((child) => (
							<TouchableOpacity
								key={child.id}
								style={styles.card}
								activeOpacity={0.85}
								onPress={() =>
									navigation.push("SubsectionScreen", {
										sectionId,
										subsectionPath: [...subsectionPath, child.id],
									})
								}
							>
								<Text style={styles.cardTitle}>
									{capitalizeFirstLetter(
										child.title[currentLanguage] || child.title.ru
									)}
								</Text>
							</TouchableOpacity>
						))}
					</View>
				) : subsection?.items?.length ? (
					<View style={styles.list}>
						{activeVideo ? (
							<View style={styles.videoCard}>
								<Text style={styles.videoTitle}>{activeVideo.title}</Text>
								<View style={styles.videoContainer}>
									<CustomVideoPlayer
										videoSource={activeVideo.source}
										hasPrev={activePlayableIndex > 0}
										hasNext={
											activePlayableIndex >= 0 &&
											activePlayableIndex < playableItems.length - 1
										}
										onPrev={() => selectPlayableByIndex(activePlayableIndex - 1)}
										onNext={() => selectPlayableByIndex(activePlayableIndex + 1)}
										onEnd={() => {
											selectPlayableByIndex(activePlayableIndex + 1);
										}}
									/>
								</View>
							</View>
						) : null}

						<View style={styles.lessonsBlock}>
							{subsection.items.map((item, index) => {
								const isActive = activeVideo?.id === item.id;
								const isLocked = isLockedItem(item, index);
								const videoSource =
									item.video?.[currentLanguage] || item.video?.ru;
								const canOpen = !!videoSource && !isLocked;

								return (
									<TouchableOpacity
										key={item.id}
										style={[
											styles.lessonItem,
											isLocked ? styles.lockedLessonItem : null,
										]}
										activeOpacity={canOpen ? 0.85 : 1}
										disabled={!canOpen}
										onPress={() => {
											if (!videoSource) {
												return;
											}
											if (isLocked) {
												return;
											}

											setActiveVideo({
												title: capitalizeFirstLetter(
													item.title[currentLanguage] || item.title.ru
												),
												source: videoSource,
												id: item.id,
											});
										}}
									>
										<Ionicons
											name={
												isLocked
													? "lock-closed-outline"
													: isActive
													? "book"
													: "play-outline"
											}
											size={20}
											color={isLocked ? "#9CA3AF" : isActive ? "#F7543E" : "#1F2937"}
										/>
										<Text
											style={[
												styles.lessonItemText,
												isLocked ? styles.lockedLessonItemText : null,
												isActive ? styles.currentLessonItemText : null,
											]}
										>
											{capitalizeFirstLetter(
												item.title[currentLanguage] || item.title.ru
											)}
										</Text>
									</TouchableOpacity>
								);
							})}
						</View>
					</View>
				) : (
					<Text style={styles.subtitle}>{t("sections.comingSoon")}</Text>
				)}
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#F8FAFC" },
	content: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 24, gap: 12 },
	title: {
		fontSize: 22,
		fontFamily: "Nunito-Bold",
		color: "#111827",
	},
	subtitle: {
		fontSize: 16,
		fontFamily: "Nunito-Regular",
		color: "#4B5563",
	},
	list: { gap: 12 },
	videoCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: 14,
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderWidth: 1,
		borderColor: "#E5E7EB",
	},
	videoTitle: {
		fontSize: 16,
		fontFamily: "Nunito-Bold",
		color: "#111827",
		marginBottom: 8,
	},
	videoContainer: {
		width: "100%",
	},
	card: {
		backgroundColor: "#FFFFFF",
		borderRadius: 14,
		paddingHorizontal: 16,
		paddingVertical: 14,
		borderWidth: 1,
		borderColor: "#E5E7EB",
	},
	cardTitle: {
		fontSize: 16,
		fontFamily: "Nunito-Bold",
		color: "#111827",
	},
	lessonsBlock: {
		backgroundColor: "#FFFFFF",
		padding: 8,
		borderRadius: 12,
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
	lockedLessonItem: {
		opacity: 0.65,
	},
	lessonItemText: {
		fontSize: 16,
		fontFamily: "Nunito-Regular",
		color: "#1F2937",
		marginLeft: 8,
	},
	lockedLessonItemText: {
		color: "#6B7280",
	},
	currentLessonItemText: {
		color: "#F7543E",
	},
});
