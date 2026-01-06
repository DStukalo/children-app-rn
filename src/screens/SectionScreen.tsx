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
import { findSectionById } from "../utils/sectionsData";
import { useNavigation } from "@react-navigation/native";

type Props = NativeStackScreenProps<MainStackParamList, "SectionScreen">;

export default function SectionScreen({ route }: Props) {
	const { t, i18n } = useTranslation();
	const { sectionId } = route.params;
	const navigation = useNavigation<any>();
	const section = findSectionById(sectionId);
	const currentLanguage = i18n.language === "ru" ? "ru" : "en";

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView
				contentContainerStyle={styles.content}
				showsVerticalScrollIndicator={false}
			>
				<Text style={styles.title}>{t(`sections.${sectionId}.title`)}</Text>

				{section?.subsections?.length ? (
					<View style={styles.courseList}>
						{section.subsections.map((subsection) => (
							<TouchableOpacity
								key={subsection.id}
								style={styles.courseCard}
								activeOpacity={0.85}
								onPress={() =>
									navigation.navigate("SubsectionScreen", {
										sectionId,
										subsectionPath: [subsection.id],
									})
								}
							>
								<Text style={styles.courseTitle}>
									{subsection.title[currentLanguage] || subsection.title.ru}
								</Text>
							</TouchableOpacity>
						))}
					</View>
				) : section?.courses?.length ? (
					<View style={styles.courseList}>
						{section.courses.map((course) => (
							<TouchableOpacity
								key={course.id}
								style={styles.courseCard}
								activeOpacity={0.85}
								onPress={() => navigation.navigate("CourseScreen", { id: course.id })}
							>
								<Text style={styles.courseTitle}>
									{course.title[currentLanguage] || course.title.ru}
								</Text>
								<Text style={styles.courseSubtitle}>
									{course.subtitle?.[currentLanguage] || course.subtitle?.ru || ""}
								</Text>
							</TouchableOpacity>
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
	content: {
		paddingHorizontal: 20,
		paddingTop: 24,
		paddingBottom: 24,
		gap: 12,
	},
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
	courseList: {
		gap: 12,
	},
	courseCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: 14,
		paddingHorizontal: 16,
		paddingVertical: 14,
		borderWidth: 1,
		borderColor: "#E5E7EB",
	},
	courseTitle: {
		fontSize: 16,
		fontFamily: "Nunito-Bold",
		color: "#111827",
	},
	courseSubtitle: {
		marginTop: 6,
		fontSize: 14,
		fontFamily: "Nunito-Regular",
		color: "#6B7280",
	},
});
