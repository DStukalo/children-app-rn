import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as RNLocalize from "react-native-localize";
import AsyncStorage from "@react-native-async-storage/async-storage";
import translationEn from "./en";
import translationRu from "./ru";

const resources = {
	"en-US": { translation: translationEn },
	ru: { translation: translationRu },
};

i18n.use(initReactI18next).init({
	resources,
	lng: "en-US",
	fallbackLng: "en-US",
	interpolation: { escapeValue: false },
});

export const initI18n = async () => {
	const savedLang = await AsyncStorage.getItem("language");
	const deviceLang = RNLocalize.getLocales()[0]?.languageTag || "en-US";

	const lang = savedLang || deviceLang;

	await i18n.changeLanguage(lang);
};

export default i18n;
