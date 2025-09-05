module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'nativewind/babel',
    'react-native-reanimated/plugin',
    [
      'module:react-native-dotenv',
      {
        envName: 'APP_ENV', // Optional: specify your environment variable name
        moduleName: '@env', // The default module name to import
        path: '.env', // The path to your .env file
        safe: false, // Optional: enable/disable safe mode
        allowUndefined: true, // Optional: allow undefined variables
        verbose: false, // Optional: output more details to the console
      },
    ],
  ],
};
