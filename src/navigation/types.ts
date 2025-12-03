import { NavigatorScreenParams } from "@react-navigation/native";
export type MainStackParamList = {
	HomeScreen: undefined;
	ChooseStageScreen: undefined;
	StageScreen: { stageId: number };
	CourseScreen: { id: number };
	LessonScreen: { lessonId: number; courseId: number };
	ProfileScreen: undefined;
	PaymentScreen: {
		courseId?: number | string;
		stageId?: number | string;
		showAllAccess?: boolean;
	};
	LoginScreen:
		| {
				redirectTo?: keyof MainStackParamList;
				courseId?: number | string;
				stageId?: number | string;
				showAllAccess?: boolean;
		  }
		| undefined;
	CheckLoginWhenPayScreen: {
		courseId?: number | string;
		stageId?: number | string;
		showAllAccess?: boolean;
	};
	RegisterScreen:
		| {
				redirectTo?: keyof MainStackParamList;
				courseId?: number | string;
				stageId?: number | string;
				showAllAccess?: boolean;
		  }
		| undefined;
	WebPayScreen: {
		paymentUrl: string;
		courseId?: number;
		stageId?: number;
		amount: number;
		description: string;
		isFullAccess?: boolean;
	};
};

export type RootTabParamList = {
	Tabs: NavigatorScreenParams<MainStackParamList>;
};

export type RootStackParamList = {
	Tabs: MainStackParamList;
};
