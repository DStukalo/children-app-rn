import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStoredUser, UserWithPurchases } from "../utils/purchaseStorage";
import { getAllCourses } from "../utils/courseData";
import { useFocusEffect } from "@react-navigation/native";

/**
 * Hook to check if user has premium access.
 * Premium = has role "Premium User" OR has purchased all courses.
 */
export function useIsPremiumUser() {
	const [isPremiumUser, setIsPremiumUser] = useState(false);

	const checkUserRole = useCallback(async () => {
		try {
			const email = await AsyncStorage.getItem("user_email");
			if (!email) {
				setIsPremiumUser(false);
				return;
			}

			const storedUser = await getStoredUser();
			if (!storedUser || storedUser.email !== email) {
				setIsPremiumUser(false);
				return;
			}

			// Check if user has "Premium User" role
			if (storedUser.role === "Premium User") {
				setIsPremiumUser(true);
				return;
			}

			// Check if user has purchased all courses
			const allCourses = getAllCourses();
			const allCourseIds = allCourses.map(c => c.id);
			const purchasedIds = storedUser.openCategories ?? [];
			
			const hasAllCourses = allCourseIds.length > 0 && 
				allCourseIds.every(id => purchasedIds.includes(id));
			
			setIsPremiumUser(hasAllCourses);
		} catch (err) {
			console.error("Failed to check user role:", err);
			setIsPremiumUser(false);
		}
	}, []);

	// Check on mount
	useEffect(() => {
		checkUserRole();
	}, [checkUserRole]);

	// Re-check when screen comes into focus (after payment)
	useFocusEffect(
		useCallback(() => {
			checkUserRole();
		}, [checkUserRole])
	);

	return isPremiumUser;
}

/**
 * Hook to check if user has access to a specific course.
 * Access = premium user OR course is in openCategories.
 */
export function useHasCourseAccess(courseId: number) {
	const [hasAccess, setHasAccess] = useState(false);
	const isPremiumUser = useIsPremiumUser();

	const checkAccess = useCallback(async () => {
		if (isPremiumUser) {
			setHasAccess(true);
			return;
		}

		try {
			const storedUser = await getStoredUser();
			const purchasedIds = storedUser?.openCategories ?? [];
			setHasAccess(purchasedIds.includes(courseId));
		} catch (err) {
			console.error("Failed to check course access:", err);
			setHasAccess(false);
		}
	}, [courseId, isPremiumUser]);

	useEffect(() => {
		checkAccess();
	}, [checkAccess]);

	useFocusEffect(
		useCallback(() => {
			checkAccess();
		}, [checkAccess])
	);

	return hasAccess;
}
