// import React from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { StackNavigationProp } from "@react-navigation/stack";
// import { ProfileStackParamList } from "../navigation/types";

// type ProfileScreenNavigationProp = StackNavigationProp<
// 	ProfileStackParamList,
// 	"ProfileScreen"
// >;

// const ProfileScreen = () => {
// 	const navigation = useNavigation<ProfileScreenNavigationProp>();

// 	return (
// 		<View style={styles.container}>
// 			<Text style={styles.title}>Profile</Text>

// 			<TouchableOpacity
// 				style={styles.button}
// 				onPress={() => navigation.navigate("PasswordScreen")}
// 			>
// 				<Text style={styles.buttonText}>Go to Password Screen</Text>
// 			</TouchableOpacity>

// 			<TouchableOpacity
// 				style={styles.button}
// 				onPress={() =>
// 					navigation.navigate("PaymentScreen", {
// 						showAllAccess: true,
// 					})
// 				}
// 			>
// 				<Text style={styles.buttonText}>Go to Payment Screen</Text>
// 			</TouchableOpacity>
// 		</View>
// 	);
// };

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		justifyContent: "center",
// 		alignItems: "center",
// 		backgroundColor: "#F8FAFC",
// 	},
// 	title: {
// 		fontSize: 22,
// 		fontWeight: "bold",
// 		marginBottom: 30,
// 	},
// 	button: {
// 		backgroundColor: "#3B82F6",
// 		padding: 15,
// 		borderRadius: 8,
// 		marginBottom: 15,
// 		width: "70%",
// 		alignItems: "center",
// 	},
// 	buttonText: {
// 		color: "#FFFFFF",
// 		fontSize: 16,
// 		fontWeight: "bold",
// 	},
// });

// export default ProfileScreen;
import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../navigation/types";

type ProfileScreenNavigationProp = StackNavigationProp<
	MainStackParamList,
	"ProfileScreen"
>;

const ProfileScreen = () => {
	const navigation = useNavigation<ProfileScreenNavigationProp>();
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
	const [userEmail, setUserEmail] = useState<string | null>(null);

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const token = await AsyncStorage.getItem("auth_token");
				const email = await AsyncStorage.getItem("user_email");

				if (token) {
					setIsAuthenticated(true);
					setUserEmail(email);
				} else {
					setIsAuthenticated(false);
				}
			} catch (err) {
				console.error("Auth check failed:", err);
				setIsAuthenticated(false);
			}
		};

		checkAuth();
	}, []);
	
	if (isAuthenticated === null) {
		return (
			<View style={styles.loader}>
				<ActivityIndicator
					size='large'
					color='#3B82F6'
				/>
			</View>
		);
	}

	// if (!isAuthenticated) {
	// 	navigation.replace("LoginScreen");
	// 	return null;
	// }

	const handleLogout = async () => {
		await AsyncStorage.removeItem("auth_token");
		await AsyncStorage.removeItem("user_email");
		navigation.replace("LoginScreen");
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Profile</Text>

			{userEmail && <Text style={styles.email}>Email: {userEmail}</Text>}

			<TouchableOpacity
				style={styles.button}
				onPress={() => navigation.navigate("PasswordScreen")}
			>
				<Text style={styles.buttonText}>Go to Password Screen</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={styles.button}
				onPress={() =>
					navigation.navigate("PaymentScreen", { showAllAccess: true })
				}
			>
				<Text style={styles.buttonText}>Go to Payment Screen</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={[styles.button, styles.logoutButton]}
				onPress={handleLogout}
			>
				<Text style={styles.buttonText}>Log Out</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#F8FAFC",
		paddingHorizontal: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 10,
	},
	email: {
		fontSize: 16,
		color: "#555",
		marginBottom: 30,
	},
	button: {
		backgroundColor: "#3B82F6",
		padding: 15,
		borderRadius: 8,
		marginBottom: 15,
		width: "80%",
		alignItems: "center",
	},
	logoutButton: {
		backgroundColor: "#DC2626",
	},
	buttonText: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "bold",
	},
	loader: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#F8FAFC",
	},
});

export default ProfileScreen;
