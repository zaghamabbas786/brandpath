// import axios from 'axios';
import {getAuthHeader} from '../utils/apiConfig';
import Config from 'react-native-config';
import axios from 'react-native-axios';

// Function to get the ERP API base URL
export const getErpBaseUrl = () => {
  console.log('getErpBaseUrl:', Config.REACT_APP_ERP_MODE_BASE_URL);
  return Config.REACT_APP_ERP_MODE_BASE_URL;
};

// Create an Axios instance with default configuration
const apiClient = axios.create({
  baseURL: getErpBaseUrl(),
  timeout: 20000,//20 seconds timeout
  // sslPinning: {
  //   certs:[],
  // },
  headers: {
    'Content-Type': 'application/json',
  },
});

// Logging callback - will be set by store after initialization
let erpLoggingCallback = null;

// Function to set logging callback for ERP API
export const setErpApiLoggingCallback = callback => {
  erpLoggingCallback = callback;
};

// Request interceptor to track request timing and set dynamic auth header
apiClient.interceptors.request.use(
  config => {
    // Set Authorization header dynamically on each request
    const authHeader = getAuthHeader();
    if (authHeader) {
      config.headers.Authorization = authHeader;
    }

    // Log request details for debugging
    console.log('🌐 ERP API Request:', {
      url: config.baseURL + config.url,
      method: config.method?.toUpperCase(),
      hasAuth: !!authHeader,
    });

    // Attach request start time for duration tracking
    config.metadata = {startTime: new Date()};
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  response => {
    // Log successful ERP API call
    if (erpLoggingCallback) {
      const duration = response.config?.metadata?.startTime
        ? new Date() - response.config.metadata.startTime
        : 0;

      erpLoggingCallback({
        type: 'success',
        method: response.config.method.toUpperCase(),
        url: response.config.url,
        status: response.status,
        responseData: response.data, // Include response body
      });
    }
    return response;
  },
  error => {
    let statusCode = error.response ? error.response.status : 0;
    let message;

    if (error.response) {
      message =
        error.response.data?.message || 'An error occurred on the server.';
    } else if (error.request) {
      message =
        'No response received from the server. Possible network error or timeout.';
    } else {
      message = error.message || 'Unexpected error occurred';
    }

    // ALWAYS log ERP API errors
    if (erpLoggingCallback) {
      const duration = error.config?.metadata?.startTime
        ? new Date() - error.config.metadata.startTime
        : 0;

      erpLoggingCallback({
        type: 'error',
        method: error.config?.method?.toUpperCase(),
        url: error.config?.url,
        status: statusCode,
        duration,
        error: error,
        errorMessage: message,
        errorDetails: error.response?.data,
      });
    }

    return Promise.reject({
      status: statusCode,
      message,
    });
  },
);

export default apiClient;
