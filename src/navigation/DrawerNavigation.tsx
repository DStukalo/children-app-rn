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
import { getStages } from "../utils/courseData";
import { Dropdown } from "../components/Dropdown";
import { Linking } from "react-native";

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

type Lang = "en" | "ru";

export function CustomDrawerContent(props: any) {
	const navigation = useNavigation<any>();

	const { i18n, t } = useTranslation();
	const currentLang: Lang = i18n.language === "ru" ? "ru" : "en";
	const stages = getStages();

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
					navigation.navigate("ChooseStageScreen");
				}}
				labelStyle={styles.drawerTitle}
			/>
			<View style={styles.stagesContainer}>
				{stages.map((stage) => {
					const stageTitle = stage.title[currentLang] || stage.title.ru;
					return (
						<View
							key={stage.id}
							style={styles.stageSection}
						>
							<Dropdown
								item={stage}
								renderLabel={(stageItem) => (
									<TouchableOpacity
										style={styles.stageLabelRow}
										onPress={() => {
											props.navigation.closeDrawer();
											navigation.navigate("StageScreen", {
												stageId: stageItem.id,
											});
										}}
									>
										<Text style={styles.stageTitle}>{stageTitle}</Text>
									</TouchableOpacity>
								)}
								renderContent={(stageItem) => (
									<View style={styles.stageCourses}>
										{stageItem.courses.map((course) => (
											<DrawerItem
												key={`${stageItem.id}-${course.id}`}
												label={course.title[currentLang] || course.title.ru}
												onPress={() => {
													props.navigation.closeDrawer();
													navigation.navigate("CourseScreen", {
														id: course.id,
													});
												}}
												labelStyle={styles.stageCourseTitle}
												style={styles.stageCourseItem}
											/>
										))}
									</View>
								)}
							/>
						</View>
					);
				})}
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
						ПОМОЩЬ КУРАТОРОВ В ОБУЧЕНИИ, подать заявку
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.btnRedirect}
					onPress={() => {
						props.navigation.closeDrawer();
						Linking.openURL("https://aba-centr.by");
					}}
				>
					<Text style={styles.btnRedirectText}>Официальный сайт центра</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.btnRedirect}
					onPress={() => {
						props.navigation.closeDrawer();
						Linking.openURL("https://aba-minks.by");
					}}
				>
					<Text style={styles.btnRedirectText}>
						Обучение специалистов и родителей
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
						Официальный сайт автора методики
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
	stageSection: {
		marginBottom: 12,
	},
	stageLabelRow: {
		paddingVertical: 8,
	},
	stageTitle: {
		fontSize: 16,
		color: "#111",
	},
	stageCourses: {
		paddingLeft: 0,
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
		alignItems: "center",
	},
	btnRedirectText: {
		color: "#fff",
		fontFamily: "Nunito-Regular",
		fontSize: 14,
		textAlign: "center",
	},
});
