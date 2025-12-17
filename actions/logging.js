import * as types from './index';

/**
 * Log event action - sends immediately (like Sentry)
 * @param {string} level - Log level (info, warning, error, debug)
 * @param {string} message - Log message
 * @param {Object} metadata - Additional metadata
 */
export const logEventRequest = (level, message, metadata = {}) => ({
  type: types.LOG_EVENT_REQUEST,
  payload: {
    level,
    message,
    metadata,
  },
});

export const logEventSuccess = () => ({
  type: types.LOG_EVENT_SUCCESS,
});

export const logEventError = error => ({
  type: types.LOG_EVENT_ERROR,
  payload: {error},
});

// Helper actions for common log types
export const logInfo = (message, metadata = {}) =>
  logEventRequest('info', message, metadata);

export const logWarning = (message, metadata = {}) =>
  logEventRequest('warning', message, metadata);

export const logError = (message, error = null, metadata = {}) => {
  const errorData = error
    ? {
        errorMessage: error.message || String(error),
        errorStack: error.stack,
        errorName: error.name,
      }
    : {};

  return logEventRequest('error', message, {
    ...errorData,
    ...metadata,
  });
};

export const logDebug = (message, metadata = {}) =>
  logEventRequest('debug', message, metadata);

export const logScreenView = (screenName, metadata = {}) =>
  logEventRequest('info', `Screen View: ${screenName}`, {
    eventType: 'screen_view',
    screenName,
    ...metadata,
  });

export const logUserAction = (action, metadata = {}) =>
  logEventRequest('info', `User Action: ${action}`, {
    eventType: 'user_action',
    action,
    ...metadata,
  });

export const logApiCall = (method, endpoint, status, metadata = {}) =>
  logEventRequest('info', `API Call: ${method} ${endpoint}`, {
    eventType: 'api_call',
    method,
    endpoint,
    status,
    ...metadata,
  });

export const logBarcodeScan = (barcode, page, result, metadata = {}) =>
  logEventRequest('info', `Barcode Scan: ${barcode}`, {
    eventType: 'barcode_scan',
    barcode,
    page,
    result: result ? 'success' : 'failed',
    ...metadata,
  });

