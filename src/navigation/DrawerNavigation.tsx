import React from "react";
import {
	createDrawerNavigator,
	DrawerContentScrollView,
	DrawerItem,
} from "@react-navigation/drawer";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MainStack from "./MainStack";
import { CustomTabBar } from "../components/CustomTabBar";
import { useTranslation } from "react-i18next";
import { Linking } from "react-native";
import type { SectionId } from "./types";

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

export function CustomDrawerContent(props: any) {
	const navigation = useNavigation<any>();

	const { t } = useTranslation();
	const sectionIds: SectionId[] = [
		"rhythmSchemes",
		"echoSchemes",
		"drumComplex",
		"makatop",
		"interactiveVerbs",
		"articulationGymnastics",
		"readingTutor",
		"noteTutor",
	];

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
			<View style={styles.drawerHeader}>
				<Text style={styles.drawerTitle}>{t("drawerNav.sections")}</Text>
			</View>
			<View style={styles.stagesContainer}>
				{sectionIds.map((sectionId) => (
					<DrawerItem
						key={sectionId}
						label={t(`sections.${sectionId}.title`)}
						onPress={() => {
							props.navigation.closeDrawer();
							navigation.navigate("SectionScreen", { sectionId });
						}}
						labelStyle={styles.stageCourseTitle}
						style={styles.stageCourseItem}
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
			<View style={styles.divider} />
			<View>
				<TouchableOpacity
					style={styles.btnRedirect}
					onPress={() => {
						props.navigation.closeDrawer();
						Linking.openURL("https://example.com");
					}}
				>
					<Text style={styles.btnRedirectText}>
						{t("drawerNav.btnRedirect1")}
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.btnRedirect}
					onPress={() => {
						props.navigation.closeDrawer();
						Linking.openURL("https://aba-centr.by");
					}}
				>
					<Text style={styles.btnRedirectText}>
						{" "}
						{t("drawerNav.btnRedirect2")}
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.btnRedirect}
					onPress={() => {
						props.navigation.closeDrawer();
						Linking.openURL("https://aba-minks.by");
					}}
				>
					<Text style={styles.btnRedirectText}>
						{t("drawerNav.btnRedirect3")}
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.btnRedirect}
					onPress={() => {
						props.navigation.closeDrawer();
						Linking.openURL("https://filistovich.com");
					}}
				>
					<Text style={styles.btnRedirectText}>
						{t("drawerNav.btnRedirect4")}
					</Text>
				</TouchableOpacity>
			</View>
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
	stagesContainer: {
		paddingLeft: 18,
	},
	stageCourseItem: {
		marginVertical: 0,
	},
	stageCourseTitle: {
		margin: 0,
		color: "#333",
		fontSize: 15,
		padding: 0,
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

	btnRedirect: {
		backgroundColor: "#F7543E",
		paddingHorizontal: 6,
		paddingVertical: 6,
		borderRadius: 8,
		marginVertical: 10,
		height: 60,
		alignItems: "center",
		justifyContent: "center",
	},
	btnRedirectText: {
		color: "#fff",
		fontFamily: "Nunito-Regular",
		fontSize: 14,
		textAlign: "center",
	},
});
