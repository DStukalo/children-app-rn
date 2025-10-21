import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../screens/ProfileScreen";
import PaymentScreen from "../screens/PaymentScreen";
import type { MainStackParamList } from "./types";
import PasswordScreen from "../screens/PasswordScreen";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import ChooseCourseScreen from "../screens/ChooseCourseScreen";
import CourseScreen from "../screens/CourseScreen";
import LessonScreen from "../screens/LessonScreen";
import VideoScreen from "../screens/VideoScreen";

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainStack() {
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
				name='PasswordScreen'
				component={PasswordScreen}
				options={{ headerShown: true, title: "Take a Password" }}
			/>
			<Stack.Screen
				name='LoginScreen'
				component={LoginScreen}
				options={{ headerShown: true, title: "Make a Login" }}
			/>
			<Stack.Screen
				name='ChooseCourseScreen'
				component={ChooseCourseScreen}
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
				name='VideoScreen'
				component={VideoScreen}
				options={{ headerShown: true }}
			/>
		</Stack.Navigator>
	);
}
