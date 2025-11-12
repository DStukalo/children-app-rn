import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserData } from "../types/types";
import { USERS } from "../consts/consts";
import { Stage } from "./courseData";

const USER_DATA_KEY = "user_data";

export type UserWithPurchases = UserData & {
	openCategories: number[];
	purchasedStages: number[];
};

const ensurePurchaseFields = (user: UserData): UserWithPurchases => ({
	...user,
	openCategories: Array.isArray(user.openCategories)
		? [...user.openCategories]
		: [],
	purchasedStages: Array.isArray(user.purchasedStages)
		? [...user.purchasedStages]
		: [],
});

const persistUser = async (user: UserWithPurchases) => {
	await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user));

	if (user.email) {
		const index = USERS.findIndex((u) => u.email === user.email);
		if (index !== -1) {
			USERS[index] = { ...USERS[index], ...user };
		}
	}
};

export const getStoredUser = async (): Promise<UserWithPurchases | null> => {
	const jsonValue = await AsyncStorage.getItem(USER_DATA_KEY);
	if (!jsonValue) {
		return null;
	}

	try {
		const parsed = JSON.parse(jsonValue) as UserData;
		return ensurePurchaseFields(parsed);
	} catch (err) {
		console.error("Failed to parse stored user data", err);
		return null;
	}
};

export const updateStoredUser = async (
	updater: (user: UserWithPurchases) => UserWithPurchases
): Promise<UserWithPurchases | null> => {
	const currentUser = await getStoredUser();
	if (!currentUser) {
		return null;
	}

	const updatedUser = updater(currentUser);
	await persistUser(updatedUser);
	return updatedUser;
};

export const markCoursePurchased = async (
	courseId: number
): Promise<UserWithPurchases | null> => {
	return updateStoredUser((user) => {
		if (user.openCategories.includes(courseId)) {
			return user;
		}

		return {
			...user,
			openCategories: [...user.openCategories, courseId],
		};
	});
};

export const markStagePurchased = async (
	stageId: number,
	courseIds: number[]
): Promise<UserWithPurchases | null> => {
	return updateStoredUser((user) => {
		const nextStageIds = user.purchasedStages.includes(stageId)
			? user.purchasedStages
			: [...user.purchasedStages, stageId];

		const mergedCourseIds = Array.from(
			new Set([...user.openCategories, ...courseIds])
		);

		return {
			...user,
			purchasedStages: nextStageIds,
			openCategories: mergedCourseIds,
		};
	});
};

export const isCoursePurchased = (
	user: UserWithPurchases | null,
	courseId: number
) => {
	return user?.openCategories.includes(courseId) ?? false;
};

export const isStagePurchased = (
	user: UserWithPurchases | null,
	stageId: number
) => {
	return user?.purchasedStages.includes(stageId) ?? false;
};

export const getMissingPrerequisiteCourses = (
	user: UserWithPurchases | null,
	stage: Stage,
	targetCourseId: number
) => {
	const targetIndex = stage.courses.findIndex((course) => course.id === targetCourseId);
	if (targetIndex <= 0) {
		return [];
	}

	const purchasedIds = user?.openCategories ?? [];
	return stage.courses
		.slice(0, targetIndex)
		.filter((course) => !purchasedIds.includes(course.id));
};
