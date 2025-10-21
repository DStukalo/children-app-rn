import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	Alert,
	ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import coursesData from "../../data/data.json";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

const PasswordScreen = () => {
	const { i18n, t } = useTranslation();
	const navigation = useNavigation();
	const currentLang = i18n.language;

	const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
	const [coursePassword, setCoursePassword] = useState<string>("");
	const [generalPassword, setGeneralPassword] = useState<string>("");

	useEffect(() => {
		const loadCoursePassword = async () => {
			if (selectedCourse === null) return;
			try {
				const savedPassword = await AsyncStorage.getItem(
					selectedCourse.toString()
				);
				setCoursePassword(savedPassword || "");
			} catch (error) {
				console.error("Помилка при завантаженні пароля курсу:", error);
			}
		};
		loadCoursePassword();
	}, [selectedCourse]);

	useEffect(() => {
		const loadGeneralPassword = async () => {
			try {
				const savedGeneral = await AsyncStorage.getItem("generalPassword");
				setGeneralPassword(savedGeneral || "");
			} catch (error) {
				console.error("Помилка при завантаженні загального пароля:", error);
			}
		};
		loadGeneralPassword();
	}, []);

	useEffect(() => {
		navigation.setOptions({ title: t("password.title") });
	}, [navigation, t]);


	const handleConfirm = async () => {
		if (selectedCourse === null) {
			Alert.alert("Виберіть курс!");
			return;
		}

		try {
			await AsyncStorage.setItem(selectedCourse.toString(), coursePassword);
			await AsyncStorage.setItem("generalPassword", generalPassword);

			Alert.alert("Паролі збережено!");
		} catch (error) {
			console.error("Помилка збереження пароля:", error);
		}
	};

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Text style={styles.title}>Виберіть курс</Text>

			{coursesData.courses.map((course) => (
				<TouchableOpacity
					key={course.id}
					style={[
						styles.courseButton,
						selectedCourse === course.id && styles.selectedCourseButton,
					]}
					onPress={() => setSelectedCourse(course.id)}
				>
					<Text
						style={[
							styles.courseButtonText,
							selectedCourse === course.id && styles.selectedCourseText,
						]}
					>
						{course.title[currentLang as keyof typeof course.title] ||
							course.title.ru}
					</Text>
				</TouchableOpacity>
			))}

			<View style={styles.inputContainer}>
				<Text style={styles.label}>Пароль для вибраного курсу:</Text>
				<TextInput
					style={styles.input}
					value={coursePassword}
					onChangeText={setCoursePassword}
					secureTextEntry
					placeholder='Введіть пароль'
				/>
			</View>

			<View style={styles.inputContainer}>
				<Text style={styles.label}>Загальний пароль для всіх курсів:</Text>
				<TextInput
					style={styles.input}
					value={generalPassword}
					onChangeText={setGeneralPassword}
					secureTextEntry
					placeholder='Введіть загальний пароль'
				/>
			</View>

			<TouchableOpacity
				style={styles.confirmButton}
				onPress={handleConfirm}
			>
				<Text style={styles.confirmButtonText}>Підтвердити</Text>
			</TouchableOpacity>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 20,
		paddingTop: 50,
		backgroundColor: "#F8FAFC",
		flexGrow: 1,
	},
	title: {
		fontSize: 22,
		fontWeight: "bold",
		marginBottom: 20,
	},
	courseButton: {
		padding: 15,
		borderRadius: 8,
		backgroundColor: "#E5E7EB",
		marginBottom: 10,
	},
	selectedCourseButton: {
		backgroundColor: "#3B82F6",
	},
	courseButtonText: {
		fontSize: 16,
		color: "#111827",
	},
	selectedCourseText: {
		color: "#FFFFFF",
		fontWeight: "bold",
	},
	inputContainer: {
		marginTop: 20,
	},
	label: {
		marginBottom: 5,
		fontSize: 16,
		color: "#374151",
	},
	input: {
		borderWidth: 1,
		borderColor: "#D1D5DB",
		borderRadius: 8,
		padding: 10,
		fontSize: 16,
		backgroundColor: "#FFFFFF",
	},
	confirmButton: {
		marginTop: 30,
		backgroundColor: "#10B981",
		padding: 15,
		borderRadius: 8,
		alignItems: "center",
	},
	confirmButtonText: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "bold",
	},
});

export default PasswordScreen;
