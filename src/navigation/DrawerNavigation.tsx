import React, { useEffect, useState } from "react";
import {
	createDrawerNavigator,
	DrawerContentScrollView,
	DrawerItem,
} from "@react-navigation/drawer";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MainStack from "./MainStack";
import { CustomTabBar } from "../components/CustomTabBar";
import { useTranslation } from "react-i18next";
// import { Dropdown } from "../components/Dropdown";

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

type Lang = "en" | "ru";

export function CustomDrawerContent(props: any) {
	const navigation = useNavigation<any>();
	const [courses, setCourses] = useState<any[]>([]);

	const { i18n, t } = useTranslation();
	const currentLang: Lang = i18n.language === "ru" ? "ru" : "en";

	useEffect(() => {
		const data = require("../../data/data.json");
		setCourses(data.courses || []);
	}, []);

	return (
		<DrawerContentScrollView {...props}>
			<DrawerItem
				label={t("drawerNav.main")}
				onPress={() => {
					props.navigation.closeDrawer();
					navigation.navigate("HomeScreen");
				}}
				labelStyle={styles.drawerTitle}
			/>
			<View style={styles.divider} />
			<DrawerItem
				label={t("drawerNav.courses")}
				onPress={() => {
					props.navigation.closeDrawer();
					navigation.navigate("ChooseCourseScreen");
				}}
				labelStyle={styles.drawerTitle}
			/>
			<View style={styles.coursesContainer}>
				{courses.map((course) => (
					<DrawerItem
						key={course.id}
						label={course.title[currentLang] || course.title.ru}
						onPress={() => {
							props.navigation.closeDrawer();
							navigation.navigate("CourseScreen", { id: course.id });
						}}
						labelStyle={{ margin: 0, color: "#333", padding: 0 }}
					/>
				))}
			</View>
			<View style={styles.divider} />
			<DrawerItem
				label={t("drawerNav.profile")}
				onPress={() => {
					props.navigation.closeDrawer();
					navigation.navigate("ProfileScreen");
				}}
				labelStyle={styles.drawerTitle}
			/>
		</DrawerContentScrollView>
	);
}

export default function Tabs() {
	return (
		<Tab.Navigator
			screenOptions={{ headerShown: false }}
			tabBar={(props) => <CustomTabBar {...props} />}
		>
			<Tab.Screen
				name='Tabs'
				component={MainStack}
			/>
		</Tab.Navigator>
	);
}

export const DrawerNav = () => {
	return (
		<Drawer.Navigator
			drawerContent={(props) => <CustomDrawerContent {...props} />}
			screenOptions={{
				headerShown: false,
				drawerType: "front",
				drawerStyle: {
					width: 280,
					backgroundColor: "#fff",
				},
			}}
		>
			<Drawer.Screen
				name='Tabs'
				component={Tabs}
				options={{ drawerItemStyle: { display: "none" } }}
			/>
		</Drawer.Navigator>
	);
};

const styles = StyleSheet.create({
	drawerContainer: {
		flex: 1,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	loadingText: {
		marginTop: 10,
		color: "#666",
		fontSize: 14,
	},
	errorContainer: {
		padding: 15,
		backgroundColor: "#fee",
		marginHorizontal: 10,
		marginBottom: 10,
		borderRadius: 8,
		borderLeftWidth: 4,
		borderLeftColor: "#c00",
	},
	errorText: {
		color: "#c00",
		fontSize: 14,
	},
	emptyText: {
		padding: 20,
		textAlign: "center",
		color: "#999",
		fontSize: 14,
		fontStyle: "italic",
	},
	drawerHeader: {
		padding: 10,
		// paddingBottom: 10,
		// borderBottomWidth: 1,
		// borderBottomColor: "#e0e0e0",
		// marginBottom: 5,
		// backgroundColor: "#f9f9f9",
	},
	drawerTitle: {
		fontSize: 18,
		// fontWeight: "bold",
		color: "#333",
	},
	drawerItem: {
		marginVertical: 0,
		paddingVertical: 0,
	},
	drawerItemLabel: {
		fontSize: 15,
		color: "#333",
		marginLeft: -16,
	},
	coursesContainer: {
		paddingLeft: 8,
	},
	courseIcon: {
		width: 28,
		height: 28,
		borderRadius: 14,
		backgroundColor: "#F7543E",
		justifyContent: "center",
		alignItems: "center",
	},

	divider: {
		height: 1,
		backgroundColor: "#e0e0e0",
		marginVertical: 10,
		marginHorizontal: 10,
	},
});
