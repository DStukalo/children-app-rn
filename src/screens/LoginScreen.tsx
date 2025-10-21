import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	Alert,
	ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
	const navigation = useNavigation();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const handleLogin = async () => {
		if (!email.trim() || !password.trim()) {
			return Alert.alert("Помилка", "Будь ласка, заповніть усі поля");
		}

		try {
			setLoading(true);

			await new Promise<void>((res) => setTimeout(res, 1500));

			if (email === "test@example.com" && password === "123456") {
				await AsyncStorage.setItem("auth_token", "dummy_token");
				await AsyncStorage.setItem("user_email", email);

				Alert.alert("Успіх", "Ви успішно увійшли!", [
					{
						text: "OK",
						onPress: () =>
							navigation.reset({
								index: 0,
								routes: [{ name: "ProfileScreen" as never }],
							}),
					},
				]);
			} else {
				Alert.alert("Помилка", "Невірний email або пароль");
			}
		} catch (err) {
			Alert.alert("Помилка", "Щось пішло не так");
		} finally {
			setLoading(false);
		}
	};
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Авторизація</Text>

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
				placeholder='Пароль'
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
					<Text style={styles.buttonText}>Увійти</Text>
				)}
			</TouchableOpacity>

			<TouchableOpacity
				onPress={() => navigation.navigate("Register" as never)}
			>
				<Text style={styles.link}>Ще не маєте акаунта? Зареєструйтесь</Text>
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
