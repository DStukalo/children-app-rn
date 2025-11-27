import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserData } from "../types/types";
import { getAllCourses } from "./courseData";

const USER_DATA_KEY = "user_data";

export type UserWithPurchases = UserData & {
	openCategories: number[];
	purchasedStages: number[];
};

type StoredUser = UserData & { userName?: string };

const ensurePurchaseFields = (user: StoredUser): UserWithPurchases => ({
	...user,
	name: user.name ?? user.userName ?? "",
	openCategories: Array.isArray(user.openCategories)
		? [...user.openCategories]
		: Array.isArray((user as any).open_categories)
		? [...(((user as any).open_categories as number[] | undefined) ?? [])]
		: [],
	purchasedStages: Array.isArray(user.purchasedStages)
		? [...user.purchasedStages]
		: Array.isArray((user as any).purchased_stages)
		? [...(((user as any).purchased_stages as number[] | undefined) ?? [])]
		: [],
});

const persistUser = async (user: UserWithPurchases) => {
	await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
};

export const getStoredUser = async (): Promise<UserWithPurchases | null> => {
	const jsonValue = await AsyncStorage.getItem(USER_DATA_KEY);
	if (!jsonValue) {
		return null;
	}

	try {
		const parsed = JSON.parse(jsonValue) as StoredUser;
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
	targetCourseId: number
) => {
	const courses = [...getAllCourses()].sort((a, b) => a.id - b.id);
	const targetIndex = courses.findIndex(
		(course) => course.id === targetCourseId
	);
	if (targetIndex <= 0) {
		return [];
	}

	const purchasedIds = new Set(user?.openCategories ?? []);
	return courses
		.slice(0, targetIndex)
		.filter((course) => !purchasedIds.has(course.id));
};
