// @ts-check
import {call, put, fork, takeEvery, select} from 'redux-saga/effects';
import * as Keychain from 'react-native-keychain';
import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import * as types from '../actions';
import * as actions from '../actions/logging';
import * as globalApi from '../api/global';
import {decodeJwt} from '../utils/jwt';

/**
 * @typedef {import('../types/logging').DeviceInfo} DeviceInfo
 * @typedef {import('../types/logging').UserState} UserState
 * @typedef {import('../types/logging').LogEntry} LogEntry
 * @typedef {import('../types/logging').LogMetadata} LogMetadata
 * @typedef {import('../types/logging').LogLevel} LogLevel
 * @typedef {import('../types/logging').SessionContext} SessionContext
 */

/**
 * Get device information
 * @returns {DeviceInfo}
 */
const getDeviceInfo = () => ({
  platform: Platform.OS,
  platformVersion: Platform.Version + '',
  deviceName: DeviceInfo.getDeviceNameSync(),
  deviceModel: DeviceInfo.getModel(),
  deviceBrand: DeviceInfo.getBrand(),
});

/**
 * Get username from keychain
 * @returns {Generator<*, string, *>}
 */
function* getUsername() {
  try {
    const credentials = yield call(Keychain.getGenericPassword);
    if (credentials) {
      const decoded = decodeJwt(credentials.password);
      return decoded || 'unknown';
    }
    return 'unknown';
  } catch (error) {
    return 'unknown';
  }
}

/**
 * Get current user state from Redux
 * @param {any} state - Redux state
 * @returns {UserState | null}
 */
const getUserState = state => state.Global?.userState || null;

// Session context cache
/** @type {SessionContext | null} */
let sessionContext = null;

// Logging error tracking to prevent spam
let consecutiveFailures = 0;
const MAX_CONSECUTIVE_FAILURES = 3;
/** @type {number | null} */
let loggingDisabledUntil = null;

/**
 * Get or create session context (username, device, userState)
 * Always fetches fresh userState from Redux to ensure latest data
 * @returns {Generator<*, SessionContext, *>}
 */
function* getSessionContext() {
  // Always get fresh userState from Redux (it changes after login/navigation)
  const userState = yield select(getUserState);

  if (!sessionContext) {
    const username = yield call(getUsername);
    const deviceInfo = getDeviceInfo();

    sessionContext = {
      username,
      userState: null, // Will be overridden below
      device: deviceInfo,
    };
  }

  // Always return fresh userState from Redux, not cached
  // @ts-ignore - sessionContext is checked above
  return {
    ...sessionContext,
    userState: userState || null,
  };
}

// Reset session context (call when user logs out or changes)
export function resetSessionContext() {
  sessionContext = null;
  // Also reset logging failure tracking on session change
  consecutiveFailures = 0;
  loggingDisabledUntil = null;
}

/**
 * Log event saga - sends individual log immediately
 * @param {{payload: {level: LogLevel, message: string, metadata: LogMetadata}}} action - Redux action
 */
function* logEventSaga(action) {
  /** @type {LogEntry | null} */
  let logEntry = null; // Define outside try block for error logging

  try {
    // Check if logging is temporarily disabled due to repeated failures
    if (loggingDisabledUntil && Date.now() < loggingDisabledUntil) {
      // Silently skip logging during cooldown period
      return;
    }

    const {level, message, metadata} = action.payload;

    // Get session context
    // @ts-ignore - Generator return type
    const context = yield call(getSessionContext);

    // Create complete log object with all properties
    /** @type {LogEntry} */
    logEntry = {
      username: context.username,
      device: context.device,
      userState: metadata.userState || context.userState,
      information: level,
      message: message,
      eventType: metadata.eventType || 'api_call',
      screenName: metadata.screenName || '',
      url: metadata.url || null,
      menuItem: metadata.menuItem || '',
      authMethod: metadata.authMethod || null,
      barcode: metadata.barcode || null,
      page: metadata.page || null,
      statusCode: metadata.statusCode || 0,
      response: JSON.stringify(metadata.response) || null,
      errorMessage: metadata.errorMessage || null,
      errorName: metadata.errorName || null,
      errorStack: metadata.errorStack || null,
      errorDetails: metadata.errorDetails || null,
    };

    // Send immediately (fire and forget)
    yield call(globalApi.sendLogs, [logEntry]);

    // Reset failure counter on success
    consecutiveFailures = 0;
    loggingDisabledUntil = null;

    yield put(actions.logEventSuccess());
  } catch (error) {
    // Silent fail - logging should never break the app
    consecutiveFailures++;

    // If too many consecutive failures, disable logging temporarily (5 minutes)
    // Do this silently without console warnings
    if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
      loggingDisabledUntil = Date.now() + 5 * 60 * 1000; // 5 minutes
    }

    // Silently dispatch error action without console logging
    const errorMessage = error instanceof Error ? error.message : String(error);
    yield put(actions.logEventError(errorMessage));
  }
}

// Watchers
function* watchLogEventRequest() {
  // @ts-ignore - Redux saga types
  yield takeEvery(types.LOG_EVENT_REQUEST, logEventSaga);
}

const loggingSagas = [fork(watchLogEventRequest)];

export default loggingSagas;

