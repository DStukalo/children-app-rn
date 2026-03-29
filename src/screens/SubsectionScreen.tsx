import React, { useEffect, useState } from "react";
import {
	Image,
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
import { findSectionById, findSubsectionByPath } from "../utils/sectionsData";
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
	const section = findSectionById(sectionId);
	const subsection = findSubsectionByPath(sectionId, subsectionPath);
	const parentSubsection =
		subsectionPath.length > 1
			? findSubsectionByPath(sectionId, subsectionPath.slice(0, -1))
			: undefined;
	const subsectionTitle =
		subsection?.title?.[currentLanguage] ||
		subsection?.title?.ru ||
		subsectionPath[subsectionPath.length - 1];
	const categoryTitle =
		parentSubsection?.title?.[currentLanguage] ||
		parentSubsection?.title?.ru ||
		section?.title?.[currentLanguage] ||
		section?.title?.ru ||
		subsectionTitle;
	const sectionTitle =
		section?.title?.[currentLanguage] || section?.title?.ru || subsectionTitle;
	const [activeVideo, setActiveVideo] = useState<{
		id: string;
		title: string;
		source: string;
	} | null>(null);
	const isSongsSubsection =
		sectionId === "makatop" && subsection?.id === "songs";
	const isLockedItem = (
		item: { access?: "free" | "locked" },
		index: number
	) =>
		(item.access === "locked" || (isSongsSubsection && index > 0)) &&
		!isPremiumUser;
	const getItemVideoSource = (item: { video?: { en?: string; ru?: string } }) => {
		const value = item.video?.[currentLanguage];
		return typeof value === "string" ? value.trim() : "";
	};
	const playableItems =
		subsection?.items?.filter(
			(item, index) =>
				!!getItemVideoSource(item) && !isLockedItem(item, index)
		) ?? [];
	const activePlayableIndex = playableItems.findIndex(
		(item) => item.id === activeVideo?.id
	);

	const selectPlayableByIndex = (index: number) => {
		if (index < 0 || index >= playableItems.length) return;
		const nextItem = playableItems[index];
		const nextSource = getItemVideoSource(nextItem);
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
				!!getItemVideoSource(item) && !isLockedItem(item, index)
		);
		if (!firstSong) {
			setActiveVideo(null);
			return;
		}

		const source = getItemVideoSource(firstSong);
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
					{capitalizeFirstLetter(
						subsection?.subsections?.length ? sectionTitle : categoryTitle
					)}
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
								<View style={styles.cardImageWrap}>
									{child.image ? (
										<Image source={{ uri: child.image }} style={styles.cardImage} />
									) : (
										<View style={styles.placeholderImage}>
											<Ionicons name='image-outline' size={24} color='#9CA3AF' />
											<Text style={styles.placeholderText}>
												No image yet - we'll upload it shortly.
											</Text>
										</View>
									)}
								</View>
								<View style={styles.cardTextWrap}>
									<Text style={styles.cardTitle}>
										{capitalizeFirstLetter(
											child.title[currentLanguage] || child.title.ru
										)}
									</Text>
								</View>
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
						) : (
							<View style={styles.videoCard}>
								<View style={styles.mediaImageWrap}>
									{subsection?.image || section?.image ? (
										<Image
											source={{ uri: subsection?.image || section?.image }}
											style={styles.mediaImage}
										/>
									) : (
										<View style={styles.placeholderImage}>
											<Ionicons name='image-outline' size={24} color='#9CA3AF' />
											<Text style={styles.placeholderText}>
												No image yet - we'll upload it shortly.
											</Text>
										</View>
									)}
								</View>
							</View>
						)}

						<View style={styles.lessonsBlock}>
							{subsection.items.map((item, index) => {
								const isActive = activeVideo?.id === item.id;
								const isLocked = isLockedItem(item, index);
								const videoSource = getItemVideoSource(item);
								const hasVideo = !!videoSource;
								const canOpen = !!videoSource && !isLocked;
								const iconName = isLocked
									? "lock-closed-outline"
									: !hasVideo
									? "videocam-off-outline"
									: isActive
									? "book"
									: "play-outline";
								const iconColor = isLocked
									? "#9CA3AF"
									: !hasVideo
									? "#9CA3AF"
									: isActive
									? "#F7543E"
									: "#1F2937";

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
											name={iconName}
											size={20}
											color={iconColor}
										/>
										<Text
											style={[
												styles.lessonItemText,
												isLocked ? styles.lockedLessonItemText : null,
												!hasVideo ? styles.missingVideoLessonItemText : null,
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
	mediaImageWrap: {
		width: "100%",
		aspectRatio: 16 / 9,
		borderRadius: 8,
		overflow: "hidden",
		backgroundColor: "#E5E7EB",
	},
	mediaImage: {
		width: "100%",
		height: "100%",
	},
	card: {
		backgroundColor: "#FFFFFF",
		borderRadius: 14,
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderWidth: 1,
		borderColor: "#E5E7EB",
		minHeight: 112,
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	cardImageWrap: {
		width: 82,
		height: 82,
		borderRadius: 12,
		overflow: "hidden",
		backgroundColor: "#E5E7EB",
	},
	cardImage: {
		width: "100%",
		height: "100%",
	},
	placeholderImage: {
		width: "100%",
		height: "100%",
		backgroundColor: "#E5E7EB",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 6,
		gap: 4,
	},
	placeholderText: {
		fontSize: 10,
		lineHeight: 12,
		textAlign: "center",
		color: "#6B7280",
		fontFamily: "Nunito-Regular",
	},
	cardTextWrap: {
		flex: 1,
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
	missingVideoLessonItemText: {
		color: "#6B7280",
	},
	currentLessonItemText: {
		color: "#F7543E",
	},
});
