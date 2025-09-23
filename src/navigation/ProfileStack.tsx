import React from "react";
import ProfileScreen from "../screens/ProfileScreen";
import PaymentScreen from "../screens/PaymentScreen";
import { Stack } from './Stack';

export default function ProfileStack() {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name='ProfileScreen'
				component={ProfileScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name='PaymentScreen'
				component={PaymentScreen}
				options={{ headerShown: true, title: "PaymentScreen" }}
			/>
		</Stack.Navigator>
	);
}
