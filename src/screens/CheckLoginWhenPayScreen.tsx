import React, { useEffect } from "react";
import {
	Dimensions,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Linking,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import { MainStackParamList } from "../navigation/types";
import i18n from "../../localization/i18n";
import { useTranslation } from "react-i18next";

const { width } = Dimensions.get("window");
const videoContainerWidth = width - 16;
type Props = StackScreenProps<MainStackParamList, "CheckLoginWhenPayScreen">;

export default function CheckLoginWhenPayScreen({ route, navigation }: Props) {
	const { courseId, showAllAccess, stageId } = route.params;

	const { i18n, t } = useTranslation();
	const currentLanguage = i18n.language;

	useEffect(() => {
		navigation.setOptions({
			title: t("checkLogin.title"),
		});
	}, [currentLanguage]);

	const handleToLogin = () => {
		navigation.navigate("LoginScreen", {
			courseId: courseId,
			stageId: stageId,
			redirectTo: "PaymentScreen",
			showAllAccess: showAllAccess,
		});
	};

	const handleToRegister = () => {
		navigation.navigate("RegisterScreen", {
			courseId: courseId,
			stageId: stageId,
			redirectTo: "PaymentScreen",
			showAllAccess: showAllAccess,
		});
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={styles.textContainer}>
					<Text style={styles.sectionTitle}>{t("checkLogin.text")}</Text>
				</View>
				<View style={styles.buttonContainer}>
					<View style={styles.paymentButtonSection}>
						<TouchableOpacity
							style={styles.paymentButton}
							onPress={handleToLogin}
							activeOpacity={0.8}
						>
							<View style={styles.paymentButton}>
								<Ionicons
									// name='logo-paypal'
									name='log-in-outline'
									size={24}
									color='#fff'
								/>
								<Text style={styles.buttonText}>{t("checkLogin.login")}</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.paymentButton}
							onPress={handleToRegister}
							activeOpacity={0.8}
						>
							<View style={styles.paymentButton}>
								<Ionicons
									name='person-add-outline'
									size={20}
									color='#fff'
								/>
								<Text style={styles.buttonText}>
									{t("checkLogin.registration")}
								</Text>
							</View>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#F8FAFC" },
	textContainer: {
		marginTop: 20,
		paddingHorizontal: 28,
		paddingVertical: 16,
	},
	sectionTitle: {
		fontSize: 20,
		fontFamily: "Nunito-Bold",
		color: "#000",
		textAlign: "center",
	},
	buttonContainer: {
		marginTop: 10,
		paddingHorizontal: 28,
	},
	paymentButtonSection: {
		gap: 10,
	},
	paymentButton: {
		backgroundColor: "#F7543E",
		paddingHorizontal: 4,
		paddingVertical: 6,
		borderRadius: 8,
		gap: 10,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",

		flexWrap: "wrap",
	},
	buttonText: {
		color: "#fff",
		fontFamily: "Nunito-Regular",
		fontSize: 14,
		alignItems: "center",
		justifyContent: "center",
		flexWrap: "wrap",
	},
});
