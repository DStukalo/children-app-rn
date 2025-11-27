import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserData } from "../types/types";
import { AUTH_BASE_URL, normalizeUser } from "./authService";

type ServerUser = Partial<UserData> & {
	email: string;
	userName?: string | null;
	open_categories?: number[];
	purchased_stages?: number[];
};

type MeResponse = {
	user?: ServerUser;
	message?: string;
};

const ME_ENDPOINT = "/me";

const buildUrl = (path: string) => {
	return `${AUTH_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

const parseMeResponse = async (response: Response) => {
	try {
		return (await response.json()) as MeResponse;
	} catch {
		return null;
	}
};

const getAuthToken = async () => {
	const token = await AsyncStorage.getItem("auth_token");
	if (!token) {
		throw new Error("Missing auth token. Please log in again.");
	}
	return token;
};

const requestUser = async (
	method: "GET" | "PATCH",
	body?: Record<string, unknown>
) => {
	const token = await getAuthToken();
	const response = await fetch(buildUrl(ME_ENDPOINT), {
		method,
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		...(body ? { body: JSON.stringify(body) } : {}),
	});

	const data = await parseMeResponse(response);
	if (!response.ok || !data?.user) {
		throw new Error(data?.message || "User request failed.");
	}

	return normalizeUser({
		...data.user,
		openCategories: data.user.open_categories ?? data.user.openCategories,
		purchasedStages: data.user.purchased_stages ?? data.user.purchasedStages,
	});
};

export const fetchCurrentUser = () => {
	return requestUser("GET");
};

export type UserUpdatePayload = Partial<UserData> & {
	email?: string;
};

export const updateCurrentUser = (updates: UserUpdatePayload) => {
	const payload: Record<string, unknown> = {};

	if (updates.email) {
		payload.email = updates.email;
	}
	if (updates.userName !== undefined) {
		payload.userName = updates.userName;
	}
	if (updates.avatar !== undefined) {
		payload.avatar = updates.avatar;
	}
	if (updates.openCategories !== undefined) {
		payload.open_categories = updates.openCategories;
	}
	if (updates.purchasedStages !== undefined) {
		payload.purchased_stages = updates.purchasedStages;
	}

	return requestUser("PATCH", payload);
};
