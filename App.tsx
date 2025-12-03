import React, { useEffect, useState } from "react";
import {
	StatusBar,
	useColorScheme,
	View,
	ActivityIndicator,
	Linking,
	Alert,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
	createNavigationContainerRef,
	NavigationContainer,
} from "@react-navigation/native";
import SystemNavigationBar from "react-native-system-navigation-bar";
import { I18nextProvider } from "react-i18next";
import i18n, { initI18n } from "./localization/i18n";
import { DrawerNav } from "./src/navigation/DrawerNavigation";
import { SafeAreaView } from "react-native-safe-area-context";

export const navigationRef = createNavigationContainerRef();

const linking = {
	prefixes: ["childapp://"],
	config: {
		screens: {
			Main: {
				screens: {
					HomeScreen: "payment-success",
				},
			},
		},
	},
};

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

	useEffect(() => {
		const handleDeepLink = (event: { url: string }) => {
			const url = event.url;
			console.log("Deep link received:", url);
			
			if (url.includes("payment-success")) {
				Alert.alert("Оплата успешна!", "Спасибо за покупку. Ваш доступ активирован.");
			} else if (url.includes("payment-cancel")) {
				Alert.alert("Оплата отменена", "Платеж не был завершен. Попробуйте снова.");
			}
		};

		const subscription = Linking.addEventListener("url", handleDeepLink);

		Linking.getInitialURL().then((url) => {
			if (url) {
				handleDeepLink({ url });
			}
		});

		return () => {
			subscription.remove();
		};
	}, []);

	// useEffect(() => {
	// 	SystemNavigationBar.stickyImmersive();
	// 	return () => {
	// 		SystemNavigationBar.navigationShow();
	// 	};
	// }, []);

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
				<SafeAreaView
					style={{ flex: 1 }}
					edges={["left", "right", "bottom"]}
				>
					<StatusBar
						barStyle={isDarkMode ? "light-content" : "dark-content"}
						backgroundColor={isDarkMode ? "#000" : "#fff"}
					/>
				<NavigationContainer ref={navigationRef} linking={linking}>
					<DrawerNav />
				</NavigationContainer>
				</SafeAreaView>
			</SafeAreaProvider>
		</I18nextProvider>
	);
}
