// utils
import AsyncStorage from '@react-native-async-storage/async-storage';

// ----------------------------------------------------------------------
let expiredTimer;

export const isValidToken = user => {
  if (!user) {
    return false;
  }

  const currentTime = Date.now() / 1000;

  return user.timeoutMins > currentTime;
};

export const tokenExpired = exp => {
  const timeLeft = exp * 60 * 1000;

  clearTimeout(expiredTimer);

  return new Promise(resolve => {
    expiredTimer = setTimeout(async () => {
      await AsyncStorage.setItem('timeout', 'true');

      // Navigate to the login screen

      resolve(true); // Indicate token expiration
    }, timeLeft);
  });
};

// ----------------------------------------------------------------------

export const setSession = async data => {
  if (data) {
    await AsyncStorage.removeItem('timeout');

    // Trigger the token expiration handling
    const handleExpiry = await tokenExpired(data.result.timeoutMins); // Use token expiration logic

    if (handleExpiry) {
      return {expired: true, message: 'Token has expired'}; // Token expired
    }
    return {expired: false}; // Token still valid
  } else {
    // await AsyncStorage.removeItem('user');
    // await AsyncStorage.removeItem('homescreen');
    return {expired: true, message: 'Session data is missing'};
  }
};

export const clearTokenTimeout = () => {
  clearTimeout(expiredTimer); // Clear the timeout on logout
};
