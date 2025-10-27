import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {
	useNavigation,
	useNavigationState,
	NavigationState,
	PartialState,
} from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { CommonActions } from "@react-navigation/native";
import { navigationRef } from "../../App";

type DrawerNavProp = DrawerNavigationProp<any>;

function getCurrentRouteName(
	state: NavigationState | PartialState<NavigationState> | undefined
): string {
	if (!state || !state.routes || state.routes.length === 0) {
		return "";
	}

	const route = state.routes[state.index ?? state.routes.length - 1];

	if (route.state) {
		return getCurrentRouteName(route.state as NavigationState);
	}

	return route.name;
}

export function CustomTabBar(props: any) {
	const navigation = useNavigation<any>();

	const currentRoute = useNavigationState((state) =>
		getCurrentRouteName(state)
	);

	const isHomeActive = currentRoute === "HomeScreen";
	const isProfileActive = currentRoute === "ProfileScreen";

	const activeColor = "#F7543E";
	const inactiveColor = "#999";

	const navigateToScreen = (screenName: string) => {
		if (navigationRef.isReady()) {
			navigationRef.navigate(screenName as never);
		}
	};

	return (
		<View style={styles.tabContainer}>
			<TouchableOpacity
				onPress={() => navigateToScreen("HomeScreen")}
				style={styles.tabButton}
			>
				<Icon
					name={isHomeActive ? "home" : "home-outline"}
					size={26}
					color={isHomeActive ? activeColor : inactiveColor}
				/>
			</TouchableOpacity>

			<TouchableOpacity
				onPress={() => navigateToScreen("ProfileScreen")}
				style={styles.tabButton}
			>
				<Icon
					name={isProfileActive ? "person" : "person-outline"}
					size={26}
					color={isProfileActive ? activeColor : inactiveColor}
				/>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	tabContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		paddingVertical: 12,
		borderTopWidth: 1,
		borderTopColor: "#eee",
		backgroundColor: "#fff",
	},
	tabButton: {
		alignItems: "center",
		justifyContent: "center",
		flex: 1,
	},
});
