import React from "react";
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
import { useNavigation } from "@react-navigation/native";

type Props = NativeStackScreenProps<MainStackParamList, "SubsectionScreen">;

export default function SubsectionScreen({ route }: Props) {
	const { t, i18n } = useTranslation();
	const navigation = useNavigation<any>();
	const { sectionId, subsectionPath } = route.params;
	const currentLanguage = i18n.language === "ru" ? "ru" : "en";
	const subsection = findSubsectionByPath(sectionId, subsectionPath);

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
									navigation.navigate("SubsectionScreen", {
										sectionId,
										subsectionPath: [...subsectionPath, child.id],
									})
								}
							>
								<Text style={styles.cardTitle}>
									{child.title[currentLanguage] || child.title.ru}
								</Text>
							</TouchableOpacity>
						))}
					</View>
				) : subsection?.items?.length ? (
					<View style={styles.list}>
						{subsection.items.map((item) => (
							<View
								key={item.id}
								style={styles.card}
							>
								<Text style={styles.cardTitle}>
									{item.title[currentLanguage] || item.title.ru}
								</Text>
							</View>
						))}
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
});
