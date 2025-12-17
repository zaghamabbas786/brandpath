import axios from 'axios';
import {getApiBaseUrl, getAuthHeader} from '../utils/apiConfig';

// Create an Axios instance with default configuration
const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Logging callback - will be set by store after initialization
let loggingCallback = null;

// Configuration for automatic API logging
const loggingConfig = {
  autoLogApiCalls: true, // Set to true to log all API calls (success + errors)
};

// Function to set logging callback (called after store is created)
export const setApiLoggingCallback = callback => {
  loggingCallback = callback;
};

// Function to configure logging behavior
export const setLoggingConfig = config => {
  Object.assign(loggingConfig, config);
};

// Request interceptor to track request timing and set dynamic auth header
apiClient.interceptors.request.use(
  config => {
    // Set Authorization header dynamically on each request
    const authHeader = getAuthHeader();
    if (authHeader) {
      config.headers.Authorization = authHeader;
    }

    // Attach request start time for duration tracking
    config.metadata = {startTime: new Date()};
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle errors and log API calls
apiClient.interceptors.response.use(
  response => {
    // Log successful API call if callback is set
    // IMPORTANT: Don't log the Logging endpoint itself to prevent infinite recursion
    if (
      loggingConfig.autoLogApiCalls &&
      loggingCallback &&
      !response.config.url.includes('/mobile/Logging')
    ) {
      const duration = new Date() - response.config.metadata.startTime;
      loggingCallback({
        type: 'success',
        method: response.config.method.toUpperCase(),
        url: response.config.url,
        status: response.status,
        duration,
        responseData: response.data,  // Include response body
        responseHeaders: response.headers,
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

    // ALWAYS log API errors (even if autoLogApiCalls is disabled)
    // IMPORTANT: Don't log the Logging endpoint itself to prevent infinite recursion
    if (
      loggingCallback &&
      !error.config?.url?.includes('/mobile/Logging')
    ) {
      const duration = error.config?.metadata?.startTime
        ? new Date() - error.config.metadata.startTime
        : 0;

      loggingCallback({
        type: 'error',
        method: error.config?.method?.toUpperCase(),
        url: error.config?.url,
        status: statusCode,
        duration,
        error: error,
        errorMessage: message,
        errorDetails: error.response?.data,
        response: error.response?.data,
        responseTime: error.response?.config?.metadata?.startTime,
        responseStatus: error.response?.status,
        responseHeaders: error.response?.headers,
        responseBody: error.response?.data,
        responseError: error.response?.data,
        responseErrorMessage: error.response?.data?.message,
        responseErrorName: error.response?.data?.name,
        responseErrorStack: error.response?.data?.stack,
      });
    }

    return Promise.reject({
      status: statusCode,
      message,
    });
  },
);

export default apiClient;
