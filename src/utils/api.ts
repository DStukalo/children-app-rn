import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../consts/consts";

const apiClient = axios.create({
	baseURL: API_BASE_URL,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

apiClient.interceptors.request.use(
	async (config) => {
		const token = await AsyncStorage.getItem("auth_token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			console.error("Unauthorized - token expired");
		}
		return Promise.reject(error);
	}
);

export interface CreatePaymentRequest {
	amount: number;
	currency?: string;
	description: string;
	orderId: string;
	courseId?: number;
	stageId?: number;
}

export interface CreatePaymentResponse {
	success: boolean;
	paymentId: string;
	paymentUrl: string;
	message: string;
}

export interface PaymentStatusResponse {
	success: boolean;
	paymentId: string;
	status: "success" | "pending" | "failed";
	message: string;
}

export const createPayment = async (
	data: CreatePaymentRequest
): Promise<CreatePaymentResponse> => {
	const response = await apiClient.post<CreatePaymentResponse>(
		"/api/payment/create",
		data
	);
	return response.data;
};

export const checkPaymentStatus = async (
	paymentId: string
): Promise<PaymentStatusResponse> => {
	const response = await apiClient.get<PaymentStatusResponse>(
		`/api/payment/status/${paymentId}`
	);
	return response.data;
};

export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse {
	message: string;
	token: string;
	user: {
		id: string;
		email: string;
		password: string;
		userName: string | null;
		avatar: string | null;
		openCategories: number[];
		purchasedStages: number[];
		createdAt: string;
	};
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
	const response = await apiClient.post<LoginResponse>("/login", data);
	return response.data;
};

export interface RegisterRequest {
	email: string;
	password: string;
}

export interface RegisterResponse {
	message: string;
	user: {
		id: string;
		email: string;
		password: string;
		userName: string | null;
		avatar: string | null;
		openCategories: number[];
		purchasedStages: number[];
		createdAt: string;
	};
}

export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
	const response = await apiClient.post<RegisterResponse>("/register", data);
	return response.data;
};

export default apiClient;

