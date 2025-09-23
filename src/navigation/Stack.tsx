import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type RootStackParamList = {
	HomeScreen: undefined;
	ChooseCourseScreen: undefined;
	CourseScreen: { courseId: string };
	LessonScreen: { lessonId: string; courseId: string };
	VideoScreen: { videoId: string; courseId: string };
	ProfileScreen: undefined;
	PaymentScreen: { courseId: string; showAllAccess: boolean };
};

export const Stack = createNativeStackNavigator<RootStackParamList>();