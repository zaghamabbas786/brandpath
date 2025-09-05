import axios from 'axios';
import {getApiBaseUrl, getAuthHeader} from '../utils/apiConfig';

// Create an Axios instance with default configuration
const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
    Authorization: getAuthHeader(),
  },
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    let statusCode = error.response ? error.response.status : 0; // Fallback to 0 for network errors or no response
    let message;

    if (error.response) {
      // Handle cases where we get a response but it's an error (e.g., 4xx or 5xx status codes)
      message =
        error.response.data?.message || 'An error occurred on the server.';
    } else if (error.request) {
      // Handle cases where the request was made but no response was received (e.g., network failure, timeout)
      message =
        'No response received from the server. Possible network error or timeout.';
    } else {
      // Handle other unexpected errors, like bad request configurations
      message = error.message || 'Unexpected error occurred';
    }

    return Promise.reject({
      status: statusCode,
      message,
    });
  },
);

export default apiClient;
