import React, { useEffect, useState } from "react";
import {
	StatusBar,
	useColorScheme,
	View,
	ActivityIndicator,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
	createNavigationContainerRef,
	NavigationContainer,
} from "@react-navigation/native";
import { I18nextProvider } from "react-i18next";
import i18n, { initI18n } from "./localization/i18n";
import { DrawerNav } from "./src/navigation/DrawerNavigation";

export const navigationRef = createNavigationContainerRef();

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
				<NavigationContainer ref={navigationRef}>
					<DrawerNav />
				</NavigationContainer>
			</SafeAreaProvider>
		</I18nextProvider>
	);
}
