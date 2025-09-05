// utils
import axios from '../services/apiService';

// Function to handle Welcome api
export const testApi = () => axios.get('/mobile/Welcome');

// Function to handle login without pin
export const loginWithoutPin = username =>
  axios.post('/mobile/Login', {
    username,
  });

// Function to handle login
export const login = (username, pin, azureUserName) =>
  axios.post('/mobile/LoginPin', {
    username,
    pin,
    azureUserName,
  });

// Function to handle login
export const logout = username =>
  axios.post('/mobile/Logout', {
    username,
  });

// Function to handle changePin
export const changePin = (username, pin, newpin) =>
  axios.post('/mobile/ChangePin', {
    username,
    pin,
    newpin,
  });
