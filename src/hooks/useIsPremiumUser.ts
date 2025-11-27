import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStoredUser } from "../utils/purchaseStorage";

export function useIsPremiumUser() {
	const [isPremiumUser, setIsPremiumUser] = useState(false);

	useEffect(() => {
		const checkUserRole = async () => {
			try {
				const email = await AsyncStorage.getItem("user_email");
				if (!email) return;

				const storedUser = await getStoredUser();
				if (storedUser && storedUser.email === email) {
					setIsPremiumUser(storedUser.role === "Premium User");
					return;
				}

				setIsPremiumUser(false);
			} catch (err) {
				console.error("Failed to check user role:", err);
				setIsPremiumUser(false);
			}
		};

		checkUserRole();
	}, []);

	return isPremiumUser;
}
