import React, { useEffect } from "react";
import {
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { getStages } from "../utils/courseData";

export default function ChooseStageScreen() {
	const { i18n, t } = useTranslation();
	const navigation = useNavigation<any>();
	const currentLanguage = i18n.language === "ru" ? "ru" : "en";
	const stages = getStages();

	useEffect(() => {
		navigation.setOptions({
			title: t("choose-stage.title"),
		});
	}, [navigation, t, currentLanguage]);

	const handleStagePress = (stageId: number) => {
		navigation.navigate("StageScreen", { stageId });
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={styles.stageList}>
					{stages.map((stage) => (
						<TouchableOpacity
							key={stage.id}
							style={styles.stageCard}
							activeOpacity={0.85}
							onPress={() => handleStagePress(stage.id)}
						>
							<View style={styles.stageBadge}>
								<Text style={styles.stageBadgeText}>
									{t("choose-stage.stageNumber", { number: stage.id })}
								</Text>
							</View>
							<Text style={styles.stageTitle}>
								{stage.title[currentLanguage] || stage.title.ru}
							</Text>
							<Text style={styles.stageSubtitle}>
								{stage.subtitle[currentLanguage] || stage.subtitle.ru}
							</Text>
							<Text style={styles.stageMeta}>
								{t("choose-stage.courseCount", {
									count: stage.courses.length,
								})}
							</Text>
						</TouchableOpacity>
					))}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F8FAFC",
	},
	stageList: {
		paddingHorizontal: 20,
		paddingVertical: 16,
		gap: 16,
	},
	stageCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: 18,
		paddingHorizontal: 18,
		paddingVertical: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.08,
		shadowRadius: 6,
		elevation: 3,
	},
	stageBadge: {
		alignSelf: "flex-start",
		backgroundColor: "#FEE2E2",
		borderRadius: 999,
		paddingHorizontal: 12,
		paddingVertical: 4,
		marginBottom: 10,
	},
	stageBadgeText: {
		color: "#B91C1C",
		fontSize: 12,
		fontFamily: "Inter-SemiBold",
	},
	stageTitle: {
		fontSize: 18,
		fontFamily: "Inter-Bold",
		color: "#111827",
		marginBottom: 6,
	},
	stageSubtitle: {
		fontSize: 15,
		fontFamily: "Inter-Medium",
		color: "#4B5563",
		marginBottom: 12,
	},
	stageMeta: {
		fontSize: 13,
		fontFamily: "Inter-Regular",
		color: "#6B7280",
	},
});
