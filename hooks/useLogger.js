import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {
  logInfo,
  logWarning,
  logError,
  logDebug,
  logScreenView,
  logUserAction,
  logApiCall,
  logBarcodeScan,
} from '../actions/logging';

/**
 * Custom hook for logging - sends events immediately like Sentry
 * @returns {Object} Logger functions
 */
export const useLogger = () => {
  const dispatch = useDispatch();

  const logger = {
    info: useCallback(
      (message, metadata = {}) => {
        dispatch(logInfo(message, metadata));
      },
      [dispatch],
    ),

    warning: useCallback(
      (message, metadata = {}) => {
        dispatch(logWarning(message, metadata));
      },
      [dispatch],
    ),

    error: useCallback(
      (message, error = null, metadata = {}) => {
        dispatch(logError(message, error, metadata));
      },
      [dispatch],
    ),

    debug: useCallback(
      (message, metadata = {}) => {
        dispatch(logDebug(message, metadata));
      },
      [dispatch],
    ),

    screenView: useCallback(
      (screenName, metadata = {}) => {
        dispatch(logScreenView(screenName, metadata));
      },
      [dispatch],
    ),

    userAction: useCallback(
      (action, metadata = {}) => {
        dispatch(logUserAction(action, metadata));
      },
      [dispatch],
    ),

    apiCall: useCallback(
      (method, endpoint, status, metadata = {}) => {
        dispatch(logApiCall(method, endpoint, status, metadata));
      },
      [dispatch],
    ),

    barcodeScan: useCallback(
      (barcode, page, result, metadata = {}) => {
        dispatch(logBarcodeScan(barcode, page, result, metadata));
      },
      [dispatch],
    ),
  };

  return logger;
};

export default useLogger;

