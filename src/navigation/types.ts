import { NavigatorScreenParams } from "@react-navigation/native";

// export type HomeStackParamList = {
// 	HomeScreen: undefined;
// 	ChooseCourseScreen: undefined;
// 	CourseScreen: { courseId: string };
// 	LessonScreen: { lessonId: string; courseId: string };
// 	VideoScreen: { id: string; courseId: string };
// };

// export type ProfileStackParamList = {
// 	ProfileScreen: undefined;
// 	PaymentScreen: { courseId?: string; showAllAccess?: boolean };
// 	PasswordScreen: undefined;
// 	LoginScreen: undefined;
// };

export type MainStackParamList = {
	HomeScreen: undefined;
	ChooseCourseScreen: undefined;
	CourseScreen: { courseId: string };
	LessonScreen: { lessonId: string; courseId: string };
	VideoScreen: { id: string; courseId: string };
	ProfileScreen: undefined;
	PaymentScreen: { courseId?: string; showAllAccess?: boolean };
	PasswordScreen: undefined;
	LoginScreen: undefined;
};

export type RootTabParamList = {
	Tabs: NavigatorScreenParams<MainStackParamList>;
};

export type RootStackParamList = {
	Tabs: MainStackParamList;
};
