import { UserData } from "../types/types";

type ServerUser = Partial<UserData> & { email: string };

type AuthResponse = {
	token?: string;
	user?: ServerUser;
	message?: string;
};

type AuthResult = {
	token: string;
	user: UserData;
};

// Use production server
const AUTH_BASE_URL = "https://children-server.onrender.com";
const LOGIN_PATH = "/login";
const REGISTER_PATH = "/register";

const buildUrl = (path: string) => {
	return `${AUTH_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

const normalizeUser = (user: ServerUser): UserData => ({
	email: user.email,
	userName: user.userName ?? (user as any).userName ?? "",
	role: user.role ?? "",
	userId: user.userId ?? (user as any).id ?? "",
	avatar: user.avatar ?? "",
	openCategories: [
		...(user.openCategories ?? (user as any).open_categories ?? []),
	],
	purchasedStages: [
		...(user.purchasedStages ?? (user as any).purchased_stages ?? []),
	],
});

const parseAuthResponse = async (response: Response) => {
	try {
		return (await response.json()) as AuthResponse;
	} catch {
		return null;
	}
};

const sendAuthRequest = async (
	path: string,
	payload: Record<string, unknown>
): Promise<AuthResult> => {
	const response = await fetch(buildUrl(path), {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	const data = await parseAuthResponse(response);
	if (!response.ok || !data) {
		throw new Error(
			data?.message || "Request to authentication server failed."
		);
	}

	if (!data.user) {
		throw new Error("Server response does not include user information.");
	}

	return {
		token: data.token ?? "",
		user: normalizeUser(data.user),
	};
};

export const loginUser = (email: string, password: string) => {
	return sendAuthRequest(LOGIN_PATH, { email, password });
};

export const registerUser = (email: string, password: string) => {
	return sendAuthRequest(REGISTER_PATH, { email, password });
};

export { AUTH_BASE_URL, LOGIN_PATH, REGISTER_PATH, normalizeUser };
