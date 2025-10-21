import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

type DropdownProps<T> = {
	item: T;
	renderLabel: (item: T) => React.ReactNode;
	renderContent: (item: T) => React.ReactNode;
	initiallyOpen?: boolean;
};

export function Dropdown<T>({
	item,
	renderLabel,
	renderContent,
	initiallyOpen = false,
}: DropdownProps<T>) {
	const [open, setOpen] = useState(initiallyOpen);

	const toggle = () => setOpen((prev) => !prev);

	return (
		<View>
			<View style={styles.itemContainer}>
				<View style={{ flex: 1 }}>{renderLabel(item)}</View>
				<TouchableOpacity onPress={toggle}>
					<Icon
						name={open ? "chevron-up" : "chevron-down"}
						size={20}
						color='#333'
					/>
				</TouchableOpacity>
			</View>
			{open && <View style={styles.content}>{renderContent(item)}</View>}
		</View>
	);
}

const styles = StyleSheet.create({
	itemContainer: {
		flexDirection: "row",
		alignItems: "baseline",
		paddingRight: 20,
	},
	content: { paddingLeft: 5, paddingBottom: 5 },
});
