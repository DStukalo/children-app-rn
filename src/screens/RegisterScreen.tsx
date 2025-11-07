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

type Nav = NativeStackNavigationProp<MainStackParamList, "RegisterScreen">;
type Route = RouteProp<MainStackParamList, "RegisterScreen">;

export default function RegisterScreen() {
	const navigation = useNavigation<Nav>();

	const route = useRoute<Route>();
	const { redirectTo, courseId, showAllAccess } = route.params || {};

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const { i18n, t } = useTranslation();
	const currentLanguage = i18n.language;

	useEffect(() => {
		navigation.setOptions({
			title: t("registration.title"),
		});
	}, [currentLanguage]);

	const handleRegister = async () => {
		if (!email.trim() || !password.trim()) {
			return Alert.alert("Error", "Please fill in all fields");
		}

		try {
			setLoading(true);

			await new Promise<void>((res) => setTimeout(res, 1500));

			if (email && password) {
				await AsyncStorage.setItem("auth_token", "dummy_token");
				await AsyncStorage.setItem("user_email", email);
				await AsyncStorage.setItem("user_password", password);


				Alert.alert(t("registration.success"), t("registration.successLogin"), [
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
								navigation.reset({
									index: 0,
									routes: [{ name: "ProfileScreen" as never }],
								});
							}
						},
					},
				]);
			} else {
				Alert.alert(
					t("registration.error"),
					t("registration.incorrectEmailOrPassword")
				);
			}
		} catch (err) {
			Alert.alert(
				t("registration.error"),
				t("registration.somethingWentWrong")
			);
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
				placeholder='Password'
				placeholderTextColor='#aaa'
				secureTextEntry
				value={password}
				onChangeText={setPassword}
			/>

			<TouchableOpacity
				style={styles.button}
				onPress={handleRegister}
				disabled={loading}
			>
				{loading ? (
					<ActivityIndicator color='#fff' />
				) : (
					<Text style={styles.buttonText}>{t("registration.button")}</Text>
				)}
			</TouchableOpacity>

			<TouchableOpacity
				onPress={() => navigation.navigate("LoginScreen" as never)}
			>
				<Text style={styles.link}>{t("registration.login")}</Text>
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
