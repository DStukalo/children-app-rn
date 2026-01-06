module.exports = {
  preset: 'react-native',
  watchman: false,
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-drawer-layout|react-native-gesture-handler|react-native-reanimated)/)',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
