// Footer.tsx
import React from "react";
import {
	View,
	Text,
	StyleSheet,
	Linking,
	Alert,
	Platform,
	TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function Footer() {
	const phone = "+375296737609";
	const email = "o.filistovich@gmail.com";
	const address = "Минск, ул. Лещинского 8/4, 427";
	const encodedAddress = encodeURIComponent(address);

	const openPhone = () => {
		Linking.openURL(`tel:${phone}`).catch(() =>
			Alert.alert("Помилка", "Не вдалося відкрити телефон")
		);
	};

	const openEmail = () => {
		Linking.openURL(`mailto:${email}`).catch(() =>
			Alert.alert("Помилка", "Не вдалося відкрити пошту")
		);
	};

	const openMaps = () => {
		const url =
			Platform.OS === "ios"
				? `http://maps.apple.com/?q=${encodedAddress}`
				: `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

		Linking.openURL(url).catch(() =>
			Alert.alert("Помилка", "Не вдалося відкрити карту")
		);
	};

	return (
		<SafeAreaView
			edges={["bottom"]}
			style={styles.safe}
		>
			<View style={styles.container}>
				<Text style={styles.title}>Ольга Александровна Филистович</Text>

				<View style={styles.linksBlock}>
					<TouchableOpacity
						style={styles.row}
						onPress={openPhone}
					>
						<Ionicons
							name='call-outline'
							size={20}
							color='#fff'
						/>
						<Text style={styles.linkText}>+375 (29) 673-76-09</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.row}
						onPress={openEmail}
					>
						<Ionicons
							name='mail-outline'
							size={20}
							color='#fff'
						/>
						<Text style={styles.linkText}>{email}</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.row}
						onPress={openMaps}
					>
						<Ionicons
							name='location-outline'
							size={20}
							color='#fff'
						/>
						<Text style={[styles.linkText, { flex: 1 }]}>
							ул. Лещинского 8/4, каб. 427, метро «Кунцевщина»
						</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.contentContainer}>
					<Text style={styles.text}>
						РБ, 220140, г. Минск, ул. Лещинского, 8/4, к.427
					</Text>

					<Text style={styles.text}>УНП КА0766140 от 17.03.2023 г.</Text>

					<Text style={styles.text}>
						Зарегистрирован Инспекцией МНС по Центральному району г. Минска
					</Text>

					<Text style={styles.text}>Режим работы: пн–пт 9:00–17:00</Text>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: {
		backgroundColor: "#000",
	},
	container: {
		padding: 18,
	},
	title: {
		fontSize: 16,
		fontWeight: "700",
		color: "#fff",
		marginBottom: 8,
		textAlign: "center",
	},
	text: {
		fontSize: 14,
		color: "#fff",
		opacity: 0.9,
		marginTop: 4,
		textAlign: "left",
	},
	linksBlock: {
		marginBottom: 20,
	},
	contentContainer: {
		alignItems: "flex-start",
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		marginTop: 10,
	},
	linkText: {
		fontSize: 14,
		color: "#fff",
		fontWeight: "500",
	},
});
