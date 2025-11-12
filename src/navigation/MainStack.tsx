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
				name='CheckLoginWhenPayScreen'
				component={CheckLoginWhenPayScreen}
				options={{ headerShown: true }}
			/>
		</Stack.Navigator>
	);
}
