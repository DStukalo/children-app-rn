import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	Alert,
	ActivityIndicator,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MainStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { USERS } from "../consts/consts";
import { useAuthCheck } from "../hooks/useAuthCheck";

type Nav = NativeStackNavigationProp<MainStackParamList, "LoginScreen">;
type Route = RouteProp<MainStackParamList, "LoginScreen">;

export default function LoginScreen() {
	const navigation = useNavigation<Nav>();

	const route = useRoute<Route>();
	const { redirectTo, courseId, showAllAccess } = route.params || {};

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const { i18n, t } = useTranslation();
	const currentLanguage = i18n.language;

	const { userEmail } = useAuthCheck();

	useEffect(() => {
		navigation.setOptions({
			title: t("login.title"),
		});
	}, [currentLanguage]);

	// const handleLogin = async () => {
	// 	if (!email.trim() || !password.trim()) {
	// 		return Alert.alert("Помилка", "Будь ласка, заповніть усі поля");
	// 	}

	// 	try {
	// 		setLoading(true);

	// 		await new Promise<void>((res) => setTimeout(res, 1500));

	// 		if (email === "test@example.com" && password === "123456") {
	// 			await AsyncStorage.setItem("auth_token", "dummy_token");
	// 			await AsyncStorage.setItem("user_email", email);

	// 			Alert.alert("Успіх", "Ви успішно увійшли!", [
	// 				{
	// 					text: "OK",
	// 					onPress: () =>
	// 						navigation.reset({
	// 							index: 0,
	// 							routes: [{ name: "ProfileScreen" as never }],
	// 						}),
	// 				},
	// 			]);
	// 		} else {
	// 			Alert.alert("Помилка", "Невірний email або пароль");
	// 		}
	// 	} catch (err) {
	// 		Alert.alert("Помилка", "Щось пішло не так");
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

	// const handleLogin = async () => {
	// 	if (!email.trim() || !password.trim()) {
	// 		return Alert.alert(t("login.error"), t("login.emptyFields"));
	// 	}

	// 	try {
	// 		setLoading(true);

	// 		await new Promise<void>((res) => setTimeout(res, 1500));

	// 		const user = USERS.find(
	// 			(u) => u.email === email.trim() && u.password === password.trim()
	// 		);

	// 		if (user) {
	// 			await AsyncStorage.setItem("auth_token", "dummy_token");
	// 			await AsyncStorage.setItem("user_email", user.email);

	// 			Alert.alert(t("login.success"), t("login.successLogin"), [
	// 				{
	// 					text: "OK",
	// 					onPress: () => {
	// 						if (redirectTo === "PaymentScreen" && courseId) {
	// 							navigation.reset({
	// 								index: 0,
	// 								routes: [
	// 									{
	// 										name: "PaymentScreen",
	// 										params: { courseId, showAllAccess } as never,
	// 									},
	// 								],
	// 							});
	// 						} else {
	// 							navigation.reset({
	// 								index: 0,
	// 								routes: [{ name: "ProfileScreen" as never }],
	// 							});
	// 						}
	// 					},
	// 				},
	// 			]);
	// 		} else {
	// 			Alert.alert(t("login.error"), t("login.incorrectEmailOrPassword"));
	// 		}
	// 	} catch (err) {
	// 		Alert.alert(t("login.error"), t("login.somethingWentWrong"));
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

	const handleLogin = async () => {
		if (!email.trim() || !password.trim()) {
			return Alert.alert(t("login.error"), t("login.emptyFields"));
		}

		try {
			setLoading(true);

			await new Promise<void>((res) => setTimeout(res, 1500));

			const user = USERS.find(
				(u) => u.email === email.trim() && u.password === password.trim()
			);

			await AsyncStorage.multiSet([
				["auth_token", "dummy_token"],
				["user_email", email],
			]);

			if (user) {
				await AsyncStorage.multiSet([
					["auth_token", "dummy_token"],
					["user_email", user.email],
				]);

				setTimeout(() => {
					Alert.alert(t("login.success"), t("login.successLogin"), [
						{
							text: "OK",
							onPress: () => {
								if (redirectTo === "PaymentScreen" && courseId) {
									navigation.reset({
										index: 0,
										routes: [
											{
												name: "PaymentScreen",
												params: { courseId, showAllAccess } as never,
											},
										],
									});
								} else {
									if (email)
										navigation.reset({
											index: 0,
											routes: [{ name: "ProfileScreen" as never }],
										});
								}
							},
						},
					]);
				}, 300);
			} else {
				Alert.alert(t("login.error"), t("login.incorrectEmailOrPassword"));
			}
		} catch (err) {
			Alert.alert(t("login.error"), t("login.somethingWentWrong"));
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<TextInput
				style={styles.input}
				placeholder='Email'
				placeholderTextColor='#aaa'
				keyboardType='email-address'
				autoCapitalize='none'
				value={email}
				onChangeText={setEmail}
			/>

			<TextInput
				style={styles.input}
				placeholder={t("login.password")}
				placeholderTextColor='#aaa'
				secureTextEntry
				value={password}
				onChangeText={setPassword}
			/>

			<TouchableOpacity
				style={styles.button}
				onPress={handleLogin}
				disabled={loading}
			>
				{loading ? (
					<ActivityIndicator color='#fff' />
				) : (
					<Text style={styles.buttonText}>{t("login.button")}</Text>
				)}
			</TouchableOpacity>

			<TouchableOpacity
				onPress={() => navigation.navigate("RegisterScreen" as never)}
			>
				<Text style={styles.link}>{t("login.registration")}</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#ffffff",
		alignItems: "center",
		justifyContent: "center",
		padding: 20,
	},
	title: {
		fontSize: 28,
		color: "#fff",
		marginBottom: 30,
		fontWeight: "700",
	},
	input: {
		width: "100%",
		backgroundColor: "#fff",
		color: "#1E1E1E",
		padding: 14,
		borderRadius: 8,
		marginBottom: 16,
		borderWidth: 1,
		borderColor: "#333",
	},
	button: {
		width: "100%",
		backgroundColor: "#F7543E",
		padding: 14,
		borderRadius: 8,
		alignItems: "center",
		marginTop: 8,
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
	},
	link: {
		color: "#bbb",
		marginTop: 20,
		fontSize: 14,
	},
});
