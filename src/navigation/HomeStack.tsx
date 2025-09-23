import React from "react";
import ChooseCourseScreen from "../screens/ChooseCourseScreen";
import HomeScreen from "../screens/HomeScreen";
import CourseScreen from "../screens/CourseScreen";
import LessonScreen from "../screens/LessonScreen";
import { Stack } from './Stack';


export default function HomeStack() {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name='HomeScreen'
				component={HomeScreen}
				options={{ headerShown: false }}
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
		</Stack.Navigator>
	);
}
