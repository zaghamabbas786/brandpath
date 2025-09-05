// utils/apiConfig.js
import base64 from 'react-native-base64';
import Config from 'react-native-config';

// Function to get the API base URL
export const getApiBaseUrl = () => {
  return Config.REACT_APP_BASE_URL;
};

// Function to get the Authorization header
export const getAuthHeader = () => {
  const authUsername = Config.REACT_APP_AUTH_USERNAME;
  const authPassword = Config.REACT_APP_AUTH_PASSWORD;
  const base64Auth = base64.encode(`${authUsername}:${authPassword}`);
  return `Basic ${base64Auth}`;
};
