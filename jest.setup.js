import "react-native-gesture-handler/jestSetup";

jest.mock(
	"@react-native-async-storage/async-storage",
	() =>
		require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

jest.mock("react-native-localize", () => ({
	getLocales: () => [{ languageCode: "ru", languageTag: "ru-RU", isRTL: false }],
	addEventListener: jest.fn(),
	removeEventListener: jest.fn(),
}));

jest.mock("react-native-reanimated", () =>
	require("react-native-reanimated/mock")
);

jest.mock("react-native-vector-icons/Ionicons", () => "Ionicons");

jest.mock("react-native-sound", () => {
	const Sound = jest.fn().mockImplementation((_filename, _basePath, callback) => {
		if (typeof callback === "function") {
			callback(null);
		}
		return {
			play: jest.fn(),
			pause: jest.fn(),
			stop: jest.fn(),
			release: jest.fn(),
			getDuration: jest.fn(() => 0),
			getCurrentTime: jest.fn((cb) => cb(0)),
			setCurrentTime: jest.fn(),
			setVolume: jest.fn(),
		};
});

jest.mock("react-native-webview", () => ({
	WebView: "WebView",
}));

	Sound.MAIN_BUNDLE = "";
	Sound.setCategory = jest.fn();

	return Sound;
});
