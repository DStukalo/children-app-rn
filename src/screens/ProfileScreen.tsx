import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Image,
	ActivityIndicator,
	TextInput,
	Modal,
	FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../navigation/types";
import { useAuthCheck } from "../hooks/useAuthCheck";
import Ionicons from "react-native-vector-icons/Ionicons";
import { UserData } from "../types/types";
import { AVATAR_OPTIONS } from "../consts/consts";
import { useTranslation } from "react-i18next";
import { getStoredUser } from "../utils/purchaseStorage";
import { fetchCurrentUser, updateCurrentUser } from "../services/userService";
import { getAllCourses } from "../utils/courseData";

type ProfileScreenNavigationProp = StackNavigationProp<
	MainStackParamList,
	"ProfileScreen"
>;

const ProfileScreen = () => {
	const navigation = useNavigation<ProfileScreenNavigationProp>();
	const { isAuthenticated, userEmail } = useAuthCheck();

	const [user, setUser] = useState<UserData | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [loading, setLoading] = useState(true);
	const [avatarModalVisible, setAvatarModalVisible] = useState(false);

	const { i18n, t } = useTranslation();
	const currentLanguage = i18n.language;

	const allCourses = useMemo(() => getAllCourses(), []);
	const allCourseIds = useMemo(() => allCourses.map(c => c.id), [allCourses]);
	
	const purchasedCourseIds = user?.openCategories ?? [];
	const hasAllCourses = allCourseIds.length > 0 && purchasedCourseIds.length > 0 && allCourseIds.every(id => purchasedCourseIds.includes(id));
	const hasSomeCourses = purchasedCourseIds.length > 0;
	const unpurchasedCount = allCourseIds.filter(id => !purchasedCourseIds.includes(id)).length;

	const displayRole = hasAllCourses ? "Premium User" : user?.role;

	const persistUserLocally = async (nextUser: UserData) => {
		await AsyncStorage.setItem("user_data", JSON.stringify(nextUser));
		setUser(nextUser);
	};

	useEffect(() => {
		navigation.setOptions({
			title: t("profile.title"),
		});
	}, [currentLanguage]);

	const loadUserData = useCallback(async (showLoader = true) => {
		if (!userEmail) {
			setUser(null);
			setLoading(false);
			return;
		}

		if (showLoader) {
			setLoading(true);
		}

		try {
			// First load from local storage for quick display
			const storedUser = await getStoredUser();
			if (storedUser && storedUser.email === userEmail) {
				setUser(storedUser);
			}

			// Then sync with server to get latest data
			const token = await AsyncStorage.getItem("auth_token");
			if (token) {
				try {
					const serverUser = await fetchCurrentUser();
					await persistUserLocally(serverUser);
				} catch (serverErr: any) {
					// If token is invalid, clear it and force re-login
					if (serverErr?.message?.includes("Invalid token") || 
					    serverErr?.message?.includes("token")) {
						console.log("Token expired, clearing auth data");
						await AsyncStorage.removeItem("auth_token");
						await AsyncStorage.removeItem("user_email");
						// Keep local data but don't crash
					} else {
						console.error("Failed to sync with server:", serverErr);
					}
				}
			}
		} catch (err) {
			console.error("Failed to load user data:", err);
		} finally {
			setLoading(false);
		}
	}, [userEmail]);

	// Load on mount
	useEffect(() => {
		loadUserData(true);
	}, [loadUserData]);

	// Reload when screen comes into focus (e.g., after payment)
	useFocusEffect(
		useCallback(() => {
			loadUserData(false); // Don't show loader on focus
		}, [loadUserData])
	);

	const updateUserData = async (updatedUser: UserData) => {
		try {
			const syncedUser = await updateCurrentUser({
				email: updatedUser.email,
				userName: updatedUser.userName,
				avatar: updatedUser.avatar,
				openCategories: updatedUser.openCategories,
				purchasedStages: updatedUser.purchasedStages,
			});
			console.log("User updated successfully:", syncedUser);
			await persistUserLocally(syncedUser);
		} catch (err) {
			console.error("Failed to update user on server:", err);
			try {
				await persistUserLocally(updatedUser);
			} catch (storageError) {
				console.error("Failed to save user data locally:", storageError);
			}
		}
	};

	const handleSaveName = async () => {
		if (!user) return;
		await updateUserData(user);
		setIsEditing(false);
	};

	const handleAvatarSelect = async (nextAvatar: string) => {
		if (!user) return;
		const updatedUser = { ...user, avatar: nextAvatar };
		setUser(updatedUser);
		await updateUserData(updatedUser);
		setAvatarModalVisible(false);
	};

	const handleLogout = async () => {
		await AsyncStorage.multiRemove(["auth_token", "user_email", "user_data"]);
		navigation.replace("LoginScreen");
	};

	if (loading) {
		return (
			<View style={styles.loader}>
				<ActivityIndicator
					size='large'
					color='#3B82F6'
				/>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{userEmail ? (
				<View style={styles.header}>
					<View>
						<TouchableOpacity onPress={() => setAvatarModalVisible(true)}>
							<Image
								source={{ uri: user?.avatar }}
								style={styles.avatar}
							/>
							<View style={styles.editIcon}>
								<Ionicons
									name='camera-outline'
									size={18}
									color='#fff'
								/>
							</View>
						</TouchableOpacity>
					</View>

					<View style={styles.headerContent}>
						{isEditing ? (
							<View style={styles.editContainer}>
								<TextInput
									style={styles.input}
									value={user?.userName}
									onChangeText={(text) =>
										setUser((prev) => prev && { ...prev, userName: text })
									}
									autoFocus
								/>
								<TouchableOpacity onPress={handleSaveName}>
									<Ionicons
										name='checkmark'
										size={22}
										color='#16A34A'
									/>
								</TouchableOpacity>
							</View>
						) : (
							<View style={styles.nameContainer}>
								<Text style={styles.name}>{user?.userName}</Text>
								<TouchableOpacity onPress={() => setIsEditing(true)}>
									<Ionicons
										name='pencil'
										size={20}
										color='#F7543E'
									/>
								</TouchableOpacity>
							</View>
						)}

						<Text style={styles.role}>{displayRole}</Text>
						<View style={styles.infoContainer}>
							<Text style={styles.infoText}>📧 {userEmail}</Text>
						</View>
					</View>
				</View>
			) : (
				<View style={styles.headerWithoutUser}>
					<TouchableOpacity
						style={styles.buttonGoToLogin}
						onPress={() => navigation.navigate("LoginScreen")}
					>
						<Ionicons
							name='person-circle-outline'
							size={20}
							color='#fff'
						/>
						<Text style={styles.buttonText}>{t("profile.login")}</Text>
					</TouchableOpacity>
				</View>
			)}
			{userEmail && (
				<View style={styles.buttonsContainer}>
					{hasAllCourses ? (
						<View style={styles.premiumBadge}>
							<Ionicons name='checkmark-circle' size={24} color='#10B981' />
							<Text style={styles.premiumText}>{t("profile.fullAccess") || "Full access activated"}</Text>
						</View>
					) : (
						<TouchableOpacity
							style={styles.button}
							onPress={() =>
								navigation.navigate("PaymentScreen", { showAllAccess: true })
							}
						>
							<Ionicons
								name='card-outline'
								size={20}
								color='#fff'
							/>
							<Text style={styles.buttonText}>
								{hasSomeCourses
									? `${t("profile.buyMore") || "Buy more"} (${unpurchasedCount})`
									: t("profile.payment")
								}
							</Text>
						</TouchableOpacity>
					)}

					<TouchableOpacity
						style={[styles.button, styles.logoutButton]}
						onPress={handleLogout}
					>
						<Ionicons
							name='log-out-outline'
							size={20}
							color='#fff'
						/>
						<Text style={styles.buttonText}>{t("profile.logout")}</Text>
					</TouchableOpacity>
				</View>
			)}

			{user && (
				<Modal
					visible={avatarModalVisible}
					transparent
					animationType='fade'
				>
					<View style={styles.modalOverlay}>
						<View style={styles.modalContainer}>
							<Text style={styles.modalTitle}>{t("profile.chooseAvatar")}</Text>

							<FlatList
								data={AVATAR_OPTIONS}
								numColumns={2}
								keyExtractor={(item) => item}
								contentContainerStyle={styles.avatarList}
								renderItem={({ item }) => (
									<TouchableOpacity onPress={() => handleAvatarSelect(item)}>
										<Image
											source={{ uri: item }}
											style={styles.avatarOption}
										/>
									</TouchableOpacity>
								)}
							/>

							<TouchableOpacity
								style={styles.closeButton}
								onPress={() => setAvatarModalVisible(false)}
							>
								<Text style={styles.closeButtonText}>
									{t("profile.cancel")}
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		backgroundColor: "#F8FAFC",
		paddingHorizontal: 10,
		paddingTop: 50,
	},
	header: {
		alignItems: "center",
		paddingHorizontal: 30,
		marginBottom: 20,
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
		gap: 20,
	},
	headerWithoutUser: {
		height: "100%",
		alignItems: "center",
		justifyContent: "center",
	},
	headerContent: {
		alignItems: "center",
		marginTop: 10,
	},
	avatar: {
		width: 100,
		height: 100,
		borderRadius: 50,
		borderWidth: 2,
		borderColor: "#3B82F6",
	},
	editIcon: {
		position: "absolute",
		right: 0,
		bottom: 0,
		backgroundColor: "#3B82F6",
		borderRadius: 12,
		padding: 4,
	},
	nameContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
	},
	name: {
		fontSize: 22,
		fontWeight: "bold",
		color: "#111827",
	},
	role: {
		fontSize: 16,
		color: "#6B7280",
		marginTop: 5,
	},
	editContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
	},
	input: {
		borderWidth: 1,
		borderColor: "#CBD5E1",
		borderRadius: 6,
		paddingHorizontal: 10,
		paddingVertical: 6,
		width: 160,
		fontSize: 16,
		backgroundColor: "#fff",
	},
	infoContainer: {
		marginTop: 15,
		alignItems: "center",
	},
	infoText: {
		fontSize: 15,
		color: "#374151",
		marginBottom: 5,
	},
	buttonsContainer: {
		width: "90%",
		marginTop: 20,
	},
	button: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#3B82F6",
		padding: 15,
		borderRadius: 10,
		marginBottom: 10,
		gap: 8,
	},
	buttonGoToLogin: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 20,
		borderRadius: 10,
		gap: 8,
		backgroundColor: "#F7543E",
	},
	logoutButton: {
		backgroundColor: "#DC2626",
	},
	buttonText: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "bold",
	},
	premiumBadge: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#D1FAE5",
		padding: 15,
		borderRadius: 10,
		marginBottom: 10,
		gap: 8,
		borderWidth: 1,
		borderColor: "#10B981",
	},
	premiumText: {
		color: "#065F46",
		fontSize: 16,
		fontWeight: "bold",
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContainer: {
		width: "85%",
		backgroundColor: "#fff",
		borderRadius: 10,
		padding: 20,
		alignItems: "center",
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 15,
	},
	avatarList: {
		gap: 15,
	},
	avatarOption: {
		width: 80,
		height: 80,
		borderRadius: 40,
		margin: 10,
		borderWidth: 2,
		borderColor: "#3B82F6",
	},
	closeButton: {
		marginTop: 10,
		padding: 10,
	},
	closeButtonText: {
		color: "#3B82F6",
		fontWeight: "bold",
		fontSize: 16,
	},
	loader: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#F8FAFC",
	},
});

export default ProfileScreen;
