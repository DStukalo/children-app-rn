import React, { useEffect } from "react";
import {
	Dimensions,
	Image,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import coursesData from "../../data/data.json";

const { width } = Dimensions.get("window");

type LocalizedString = { en: string; ru: string };

type Audio = {
	audioId: number;
	title: LocalizedString;
	audio: LocalizedString;
};

type VideoSingle = LocalizedString;

type VideoMultiple = {
	videoId: number;
	title: LocalizedString;
	video: LocalizedString;
}[];

type Lesson =
	| {
			lessonId: number;
			title: LocalizedString;
			subtitle?: LocalizedString;
			description?: LocalizedString;
			video: VideoSingle;
			audio?: Audio[];
			access: string;
	  }
	| {
			lessonId: number;
			title: LocalizedString;
			subtitle?: LocalizedString;
			description?: LocalizedString;
			video: VideoMultiple;
			audio?: Audio[];
			access: string;
	  };

type Details = {
	description: LocalizedString;
	materials?: { en: unknown[]; ru: unknown[] };
	lessons: Lesson[];
	video?: VideoSingle;
};

type Course = {
	id: number;
	title: LocalizedString;
	subtitle: LocalizedString;
	image: string;
	isCompleted: boolean;
	details: Details;
};

export default function ChooseCourseScreen() {
	const { i18n, t } = useTranslation();
	const currentLanguage = i18n.language;

	const courses: Course[] = coursesData.courses;

	const navigation = useNavigation<any>();

	useEffect(() => {
		navigation.setOptions({
			title: t("choose-course.title"),
		});
	}, [currentLanguage]);

	const handleCoursePress = (id: number) => {
		navigation.navigate("CourseScreen", { id });
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={styles.courseList}>
					{courses.map((course) => (
						<TouchableOpacity
							key={course.id}
							style={styles.courseCard}
							onPress={() => handleCoursePress(course.id)}
							activeOpacity={0.8}
						>
							<View style={styles.courseImageContainer}>
								<Image
									source={{ uri: course.image }}
									style={styles.courseImage}
								/>
							</View>

							<View style={styles.courseInfo}>
								<Text style={styles.courseSubtitle}>
									{course.subtitle[
										currentLanguage as keyof typeof course.subtitle
									] || course.subtitle["ru"]}
								</Text>
							</View>
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
	courseList: {
		paddingHorizontal: 20,
		paddingVertical: 16,
	},
	courseCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: 16,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 4,
	},
	courseImageContainer: {
		position: "relative",
		height: 200,
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16,
		overflow: "hidden",
	},
	courseImage: {
		width: "100%",
		height: "100%",
		resizeMode: "cover",
	},
	courseInfo: {
		paddingHorizontal: 16,
		paddingVertical: 16,
	},
	courseSubtitle: {
		fontSize: 16,
		fontFamily: "Inter-Medium",
		color: "#4B5563",
	},
});
