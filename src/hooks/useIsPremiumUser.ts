import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { USERS } from "../consts/consts";

export function useIsPremiumUser() {
	const [isPremiumUser, setIsPremiumUser] = useState(false);

	useEffect(() => {
		const checkUserRole = async () => {
			try {
				const email = await AsyncStorage.getItem("user_email");
				if (!email) return;

				const foundUser = USERS.find((u) => u.email === email);
				setIsPremiumUser(foundUser?.role === "Premium User");
			} catch (err) {
				console.error("Failed to check user role:", err);
				setIsPremiumUser(false);
			}
		};

		checkUserRole();
	}, []);

	return isPremiumUser;
}
