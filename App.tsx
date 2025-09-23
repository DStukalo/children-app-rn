import React, { useEffect, useState } from "react";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import {
	StatusBar,
	useColorScheme,
	View,
	ActivityIndicator,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import i18n, { initI18n } from "./localization/i18n";
import { I18nextProvider } from "react-i18next";
import HomeStack from "./src/navigation/HomeStack";
import ProfileStack from "./src/navigation/ProfileStack";

const Tab = createBottomTabNavigator();

export default function App() {
	const [isI18nReady, setIsI18nReady] = useState(false);
	const isDarkMode = useColorScheme() === "dark";

	useEffect(() => {
		const init = async () => {
			await initI18n();
			setIsI18nReady(true);
		};
		init();
	}, []);

	if (!isI18nReady) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator size='large' />
			</View>
		);
	}

	return (
		<I18nextProvider i18n={i18n}>
			<SafeAreaProvider>
				<StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
				<NavigationContainer>
					<Tab.Navigator
						screenOptions={({ route }) => ({
							tabBarShowLabel: false,
							tabBarIcon: ({ focused, color, size }) => {
								let iconName = "";

								if (route.name === "Home") {
									iconName = focused ? "home" : "home-outline";
								} else if (route.name === "Profile") {
									iconName = focused ? "person" : "person-outline";
								}

								return (
									<Icon
										name={iconName}
										size={size}
										color={color}
									/>
								);
							},
							tabBarActiveTintColor: "#F7543E",
							tabBarInactiveTintColor: "gray",
							headerShown: false,
						})}
					>
						<Tab.Screen
							name='Home'
							component={HomeStack}
							options={({ route }) => {
								const routeName =
									getFocusedRouteNameFromRoute(route) ?? "HomeScreen";
								return {
									tabBarIcon: ({ focused, color, size }) => {
										let iconName = "";

										if (routeName === "HomeScreen") {
											iconName = focused ? "home" : "home-outline";
										} else {
											iconName = "home-outline";
										}

										return (
											<Icon
												name={iconName}
												size={size}
												color={color}
											/>
										);
									},
									tabBarShowLabel: false,
									tabBarActiveTintColor: "#F7543E",
									tabBarInactiveTintColor: "gray",
									headerShown: false,
								};
							}}
						/>
						<Tab.Screen
							name='Profile'
							component={ProfileStack}
						/>
					</Tab.Navigator>
				</NavigationContainer>
			</SafeAreaProvider>
		</I18nextProvider>
	);
}
