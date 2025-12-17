module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    'prettier/prettier': 0,

    // Disallow console.log but allow console.error, console.warn, etc.
    // Only error/warning/debug console methods are acceptable
    'no-console': [
      'error',
      {
        allow: ['warn', 'error', 'info', 'debug', 'trace'],
      },
    ],
  },
};
