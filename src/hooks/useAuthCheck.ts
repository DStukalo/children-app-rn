import { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export function useAuthCheck() {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
	const [userEmail, setUserEmail] = useState<string | null>(null);

	useFocusEffect(
		useCallback(() => {
			const checkAuth = async () => {
				try {
					const token = await AsyncStorage.getItem("auth_token");
					const email = await AsyncStorage.getItem("user_email");

					if (email) {
						setUserEmail(email);
					}

					if (token) {
						setIsAuthenticated(true);
					} else {
						setIsAuthenticated(false);
					}
				} catch (err) {
					console.error("Auth check failed:", err);
					setIsAuthenticated(false);
				}
			};

			checkAuth();
		}, [])
	);

	return { isAuthenticated, userEmail };
}
