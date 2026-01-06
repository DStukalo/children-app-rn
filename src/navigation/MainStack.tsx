import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../screens/ProfileScreen";
import PaymentScreen from "../screens/PaymentScreen";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import ChooseStageScreen from "../screens/ChooseStageScreen";
import CourseScreen from "../screens/CourseScreen";
import LessonScreen from "../screens/LessonScreen";
import CheckLoginWhenPayScreen from "../screens/CheckLoginWhenPayScreen";
import { MainStackParamList } from "./types";
import RegisterScreen from '../screens/RegisterScreen';
import StageScreen from "../screens/StageScreen";
import WebPayScreen from "../screens/WebPayScreen";
import SectionScreen from "../screens/SectionScreen";
import { useTranslation } from "react-i18next";
import SubsectionScreen from "../screens/SubsectionScreen";
import { findSubsectionByPath } from "../utils/sectionsData";

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainStack() {
	const { t, i18n } = useTranslation();
	const currentLanguage = i18n.language === "ru" ? "ru" : "en";
	return (
		<Stack.Navigator>
			<Stack.Screen
				name='HomeScreen'
				component={HomeScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name='ProfileScreen'
				component={ProfileScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name='PaymentScreen'
				component={PaymentScreen}
				options={{ headerShown: true, title: "Payment" }}
			/>
			<Stack.Screen
				name='RegisterScreen'
				component={RegisterScreen}
				options={{ headerShown: true }}
			/>

			<Stack.Screen
				name='LoginScreen'
				component={LoginScreen}
				options={{ headerShown: true, title: "Make a Login" }}
			/>
			<Stack.Screen
				name='ChooseStageScreen'
				component={ChooseStageScreen}
				options={{ headerShown: true }}
			/>
			<Stack.Screen
				name='StageScreen'
				component={StageScreen}
				options={{ headerShown: true }}
			/>
			<Stack.Screen
				name='CourseScreen'
				component={CourseScreen}
				options={{ headerShown: true }}
			/>
			<Stack.Screen
				name='LessonScreen'
				component={LessonScreen}
				options={{ headerShown: true }}
			/>
			<Stack.Screen
				name='SectionScreen'
				component={SectionScreen}
				options={({ route }) => ({
					headerShown: true,
					title: t(`sections.${route.params.sectionId}.title`),
				})}
			/>
			<Stack.Screen
				name='SubsectionScreen'
				component={SubsectionScreen}
				options={({ route }) => {
					const subsection = findSubsectionByPath(
						route.params.sectionId,
						route.params.subsectionPath
					);
					const localizedTitle =
						subsection?.title?.[currentLanguage] || subsection?.title?.ru;
					return {
						headerShown: true,
						title:
							localizedTitle ??
							route.params.subsectionPath[route.params.subsectionPath.length - 1],
					};
				}}
			/>
			<Stack.Screen
				name='CheckLoginWhenPayScreen'
				component={CheckLoginWhenPayScreen}
				options={{ headerShown: true }}
			/>
			<Stack.Screen
				name='WebPayScreen'
				component={WebPayScreen}
				options={{ headerShown: false }}
			/>
		</Stack.Navigator>
	);
}
