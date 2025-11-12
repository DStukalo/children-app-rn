// import React, { useEffect, useState } from "react";
// import {
// 	Dimensions,
// 	Image,
// 	SafeAreaView,
// 	ScrollView,
// 	StyleSheet,
// 	Text,
// 	TouchableOpacity,
// 	View,
// } from "react-native";
// import { useTranslation } from "react-i18next";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useNavigation } from "@react-navigation/native";

// const { width } = Dimensions.get("window");

// const methodicImages: Record<number, any> = {
// 	1: require("../../assets/images/methodic-pic1.png"),
// 	2: require("../../assets/images/methodic-pic2.png"),
// 	3: require("../../assets/images/methodic-pic3.png"),
// 	4: require("../../assets/images/methodic-pic4.png"),
// 	5: require("../../assets/images/methodic-pic5.png"),
// };

// export default function HomeScreen() {
// 	const { t, i18n } = useTranslation();
// 	const navigation = useNavigation<any>();
// 	const [currentLang, setCurrentLang] = useState(i18n.language);

// 	const nextLang = currentLang === "ru" ? "en" : "ru";
// 	const nextLangLabel = currentLang === "ru" ? "EN" : "RU";

// 	const handleLanguagePress = async () => {
// 		await AsyncStorage.setItem("language", nextLang);
// 		await i18n.changeLanguage(nextLang);
// 		setCurrentLang(nextLang);
// 	};

// 	useEffect(() => {
// 		const checkLang = async () => {
// 			const savedLang = await AsyncStorage.getItem("language");
// 			if (savedLang && savedLang !== currentLang) {
// 				await i18n.changeLanguage(savedLang);
// 				setCurrentLang(savedLang);
// 			}
// 		};
// 		checkLang();
// 	}, []);

// 	const handleCoursePress = () => {
// 		console.log("navigate to ChooseCourse");
// 		navigation.navigate("ChooseCourseScreen");
// 	};

// 	return (
// 		<SafeAreaView style={styles.container}>
// 			<ScrollView showsVerticalScrollIndicator={false}>
// 				<View style={styles.header}>
// 					<View style={styles.headerContent}>
// 						<Image
// 							source={require("../../assets/images/header-logo.png")}
// 							style={styles.logo}
// 						/>
// 						<View style={styles.headerTextBlock}>
// 							<Text style={styles.headerSubtitle}>Школа</Text>
// 							<Text style={styles.headerTitle}>Ольги Филистович</Text>
// 						</View>
// 					</View>

// 					<TouchableOpacity
// 						style={styles.langSwitch}
// 						onPress={handleLanguagePress}
// 					>
// 						<Text style={styles.langSwitchText}>{nextLangLabel}</Text>
// 					</TouchableOpacity>
// 				</View>

// 				<View style={styles.heroSection}>
// 					<Text style={styles.heroText}>{t("home.proprietaryMethods")}</Text>
// 					<Text style={styles.heroAuthor}>{t("home.author")}</Text>
// 					<TouchableOpacity
// 						style={styles.heroBtn}
// 						onPress={handleCoursePress}
// 						activeOpacity={0.8}
// 					>
// 						<Text style={styles.heroBtnTitle}>{t("home.chooseCourse")}</Text>
// 					</TouchableOpacity>
// 					<Image
// 						source={require("../../assets/images/hero.png")}
// 						style={styles.heroImage}
// 					/>
// 				</View>

// 				<View style={styles.methodicSection}>
// 					<Text style={styles.methodicTitle}>
// 						{t("home.methodicSectionTitle")}
// 					</Text>

// 					{[1, 2, 3, 4, 5].map((n) => (
// 						<View
// 							style={styles.methodicSectionDescription}
// 							key={n}
// 						>
// 							<View style={styles.methodicImageSection}>
// 								<Image
// 									source={methodicImages[n]}
// 									style={styles.methodicImage}
// 								/>
// 							</View>
// 							<Text style={styles.methodicText}>
// 								{t(`home.methodicSectionBlock${n}`)}
// 							</Text>
// 						</View>
// 					))}
// 				</View>
// 			</ScrollView>
// 		</SafeAreaView>
// 	);
// }

// const styles = StyleSheet.create({
// 	container: { flex: 1, backgroundColor: "#F8FAFC" },
// 	header: {
// 		backgroundColor: "#FFFFFF",
// 		paddingHorizontal: 20,
// 		paddingVertical: 4,
// 		marginTop: 40,
// 		borderBottomWidth: 1,
// 		borderBottomColor: "#E5E7EB",
// 		justifyContent: "space-between",
// 		flexDirection: "row",
// 		alignItems: "center",
// 	},
// 	headerContent: { flexDirection: "row", alignItems: "center" },
// 	headerTextBlock: { maxWidth: 90 },
// 	headerTitle: {
// 		fontSize: 12,
// 		fontFamily: "Nunito-Bold",
// 		color: "#000",
// 		paddingLeft: 10,
// 		lineHeight: 14,
// 	},
// 	headerSubtitle: {
// 		fontSize: 12,
// 		color: "#2e2e2e",
// 		paddingLeft: 10,
// 	},
// 	logo: { width: 41, height: 44, borderRadius: 8 },
// 	langSwitch: {
// 		backgroundColor: "#F7543E",
// 		paddingHorizontal: 12,
// 		paddingVertical: 6,
// 		borderRadius: 8,
// 	},
// 	langSwitchText: { color: "#fff", fontFamily: "Nunito-Regular", fontSize: 14 },
// 	heroSection: {
// 		backgroundColor: "#86B4CA",
// 		paddingHorizontal: 20,
// 		paddingTop: 50,
// 		paddingBottom: 20,
// 		gap: 10,
// 	},
// 	heroImage: { width: 210, height: 210, resizeMode: "contain" },
// 	heroAuthor: {
// 		fontSize: 24,
// 		fontFamily: "Nunito-Bold",
// 		fontWeight: "bold",
// 		color: "#fff",
// 		marginBottom: 10,
// 	},
// 	heroText: {
// 		fontSize: 20,
// 		fontFamily: "Nunito-Bold",
// 		fontWeight: "bold",
// 		color: "#fff",
// 	},
// 	heroBtn: {
// 		backgroundColor: "#F7543E",
// 		paddingHorizontal: 20,
// 		paddingVertical: 10,
// 		borderRadius: 50,
// 		marginBottom: 10,
// 		width: 200,
// 		alignItems: "center",
// 	},
// 	heroBtnTitle: { fontSize: 14, fontFamily: "Nunito-Regular", color: "#fff" },
// 	methodicSection: {
// 		backgroundColor: "#FBFBFB",
// 		paddingHorizontal: 20,
// 		paddingTop: 20,
// 		paddingBottom: 10,
// 		gap: 20,
// 	},
// 	methodicSectionDescription: { gap: 10 },
// 	methodicTitle: {
// 		fontSize: 24,
// 		fontFamily: "Nunito-Bold",
// 		fontWeight: "bold",
// 		color: "#2D2D33",
// 		marginBottom: 10,
// 	},
// 	methodicText: {
// 		fontSize: 20,
// 		fontFamily: "Nunito-Regular",
// 		color: "#2D2D33",
// 	},
// 	methodicImageSection: { alignItems: "center" },
// 	methodicImage: { width: 90, height: 100, resizeMode: "contain" },
// });
import React, { useEffect, useState } from "react";
import {
	Dimensions,
	Image,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import type { DrawerNavigationProp } from "@react-navigation/drawer";
import Ionicons from "react-native-vector-icons/Ionicons";
import Footer from "../components/Footer";

type RootDrawerParamList = {
	HomeScreen: undefined;
	ChooseStageScreen: undefined;
	StageScreen: { stageId: number };
	CourseScreen: { id: number };
};

const { width } = Dimensions.get("window");

const methodicImages: Record<number, any> = {
	1: require("../../assets/images/methodic-pic1.png"),
	2: require("../../assets/images/methodic-pic2.png"),
	3: require("../../assets/images/methodic-pic3.png"),
	4: require("../../assets/images/methodic-pic4.png"),
	5: require("../../assets/images/methodic-pic5.png"),
};

export default function HomeScreen() {
	const { t, i18n } = useTranslation();
	const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
	const [currentLang, setCurrentLang] = useState(i18n.language);

	const nextLang = currentLang === "ru" ? "en" : "ru";
	const nextLangLabel = currentLang === "ru" ? "EN" : "RU";

	const handleLanguagePress = async () => {
		await AsyncStorage.setItem("language", nextLang);
		await i18n.changeLanguage(nextLang);
		setCurrentLang(nextLang);
	};

	useEffect(() => {
		const checkLang = async () => {
			const savedLang = await AsyncStorage.getItem("language");
			if (savedLang && savedLang !== currentLang) {
				await i18n.changeLanguage(savedLang);
				setCurrentLang(savedLang);
			}
		};
		checkLang();
	}, []);

	const handleStagePress = () => {
		navigation.navigate("ChooseStageScreen");
	};

	const openDrawerMenu = () => {
		navigation.dispatch(DrawerActions.openDrawer());
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={styles.header}>
					<View style={styles.headerContent}>
						<TouchableOpacity
							onPress={openDrawerMenu}
							style={styles.menuButton}
						>
							<Ionicons
								name='menu'
								size={26}
								color='#000'
							/>
						</TouchableOpacity>

						<Image
							source={require("../../assets/images/header-logo.png")}
							style={styles.logo}
						/>
						<View style={styles.headerTextBlock}>
							<Text style={styles.headerSubtitle}>{t("home.title1")}</Text>
							<Text style={styles.headerTitle}>{t("home.title2")}</Text>
						</View>
					</View>

					<TouchableOpacity
						style={styles.langSwitch}
						onPress={handleLanguagePress}
					>
						<Text style={styles.langSwitchText}>{nextLangLabel}</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.heroSection}>
					<Text style={styles.heroText}>{t("home.proprietaryMethods")}</Text>
					<Text style={styles.heroAuthor}>{t("home.author")}</Text>
					<TouchableOpacity
						style={styles.heroBtn}
						onPress={handleStagePress}
						activeOpacity={0.8}
					>
						<Text style={styles.heroBtnTitle}>{t("home.chooseCourse")}</Text>
					</TouchableOpacity>
					<Image
						source={require("../../assets/images/hero.png")}
						style={styles.heroImage}
					/>
				</View>

				<View style={styles.methodicSection}>
					<Text style={styles.methodicTitle}>
						{t("home.methodicSectionTitle")}
					</Text>

					{[1, 2, 3, 4, 5].map((n) => (
						<View
							style={styles.methodicSectionDescription}
							key={n}
						>
							<View style={styles.methodicImageSection}>
								<Image
									source={methodicImages[n]}
									style={styles.methodicImage}
								/>
							</View>
							<Text style={styles.methodicText}>
								{t(`home.methodicSectionBlock${n}`)}
							</Text>
						</View>
					))}
				</View>

				<Footer />
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#F8FAFC" },
	header: {
		backgroundColor: "#FFFFFF",
		paddingHorizontal: 20,
		paddingVertical: 4,
		marginTop: 40,
		borderBottomWidth: 1,
		borderBottomColor: "#E5E7EB",
		justifyContent: "space-between",
		flexDirection: "row",
		alignItems: "center",
	},
	headerContent: { flexDirection: "row", alignItems: "center" },
	menuButton: {
		marginRight: 10,
		padding: 4,
	},
	headerTextBlock: { maxWidth: 90 },
	headerTitle: {
		fontSize: 12,
		fontFamily: "Nunito-Bold",
		color: "#000",
		paddingLeft: 10,
		lineHeight: 14,
	},
	headerSubtitle: {
		fontSize: 12,
		color: "#2e2e2e",
		paddingLeft: 10,
	},
	logo: { width: 35, height: 35, borderRadius: 8 },
	langSwitch: {
		backgroundColor: "#F7543E",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 8,
	},
	langSwitchText: { color: "#fff", fontFamily: "Nunito-Regular", fontSize: 14 },
	heroSection: {
		backgroundColor: "#86B4CA",
		paddingHorizontal: 20,
		paddingTop: 50,
		paddingBottom: 20,
		gap: 10,
	},
	heroImage: { width: 210, height: 210, resizeMode: "contain" },
	heroAuthor: {
		fontSize: 24,
		fontFamily: "Nunito-Bold",
		fontWeight: "bold",
		color: "#fff",
		marginBottom: 10,
	},
	heroText: {
		fontSize: 20,
		fontFamily: "Nunito-Bold",
		fontWeight: "bold",
		color: "#fff",
	},
	heroBtn: {
		backgroundColor: "#F7543E",
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 50,
		marginBottom: 10,
		width: 200,
		alignItems: "center",
	},
	heroBtnTitle: { fontSize: 14, fontFamily: "Nunito-Regular", color: "#fff" },
	methodicSection: {
		backgroundColor: "#FBFBFB",
		paddingHorizontal: 20,
		paddingTop: 20,
		paddingBottom: 10,
		gap: 20,
	},
	methodicSectionDescription: { gap: 10 },
	methodicTitle: {
		fontSize: 24,
		fontFamily: "Nunito-Bold",
		fontWeight: "bold",
		color: "#2D2D33",
		marginBottom: 10,
	},
	methodicText: {
		fontSize: 20,
		fontFamily: "Nunito-Regular",
		color: "#2D2D33",
	},
	methodicImageSection: { alignItems: "center" },
	methodicImage: { width: 90, height: 100, resizeMode: "contain" },
});
