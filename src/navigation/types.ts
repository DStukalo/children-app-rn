import { NavigatorScreenParams } from "@react-navigation/native";
export type MainStackParamList = {
	HomeScreen: undefined;
	ChooseCourseScreen: undefined;
	CourseScreen: { courseId: string };
	LessonScreen: { lessonId: string; courseId: string };
	ProfileScreen: undefined;
	PaymentScreen: { courseId?: string; showAllAccess?: boolean };
	LoginScreen:
		| {
				redirectTo?: keyof MainStackParamList;
				courseId?: string;
				showAllAccess?: boolean;
		  }
		| undefined;
	CheckLoginWhenPayScreen: { courseId?: string; showAllAccess?: boolean };
	RegisterScreen:
		| {
				redirectTo?: keyof MainStackParamList;
				courseId?: string;
				showAllAccess?: boolean;
		  }
		| undefined;
};

export type RootTabParamList = {
	Tabs: NavigatorScreenParams<MainStackParamList>;
};

export type RootStackParamList = {
	Tabs: MainStackParamList;
};
