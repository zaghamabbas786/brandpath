import * as Keychain from 'react-native-keychain';
import {
  takeEvery,
  call,
  put,
  fork,
  takeLatest,
  race,
  delay,
  cancel,
} from 'redux-saga/effects';
import * as types from '../actions';
import * as actions from '../actions/auth';
import * as global from '../actions/global';
import * as loggingActions from '../actions/logging';
import * as authApi from '../api/auth';
import {authorize, revoke} from 'react-native-app-auth';
import {clearTokenTimeout, setSession} from '../auth/utils';
import {navigate} from '../utils/navigate';
import {decodeJwt} from '../utils/jwt';
import {azureConfig} from '../utils/azureConfig';
import {formatError} from '../utils/errorHandler';
import {getAzureFriendlyError} from '../utils/azureErrorMapper';
import {resetSessionContext} from './logging';

function* initSession({payload}) {
  try {
    const sessionStatus = yield call(setSession, payload.data);
    if (sessionStatus.expired) {
      if (sessionStatus.message === 'Token has expired') {
        // Handle token expiration
        yield put(
          actions.loginError({
            error: [
              'Session Expired',
              'Your token has expired, please log in again.',
            ],
          }),
        );
      } else if (sessionStatus.message === 'Session data is missing') {
        // Handle missing session data
        yield put(actions.loginError({error: ['Session data is missing']}));
      }

      yield put(actions.sessionExpireRequest(payload.data.result.username));
    }
  } catch (e) {
    yield call(setSession, null);
    yield put(actions.logoutRequest(payload.data.result.username));
    const formattedError = formatError(e);
    yield put(
      actions.loginError({
        error: formattedError,
        errorText: formattedError,
      }),
    );
  }
}

function* watchInitSession() {
  yield takeLatest(types.INITIALIZE_SESSION, initSession);
}

function* azureLoginSaga() {
  yield put(actions.setLoading(true));

  try {
    // Log Azure login attempt
    yield put(
      loggingActions.logInfo('Azure login initiated', {
        eventType: 'user_action',
        action: 'azure_login_started',
      }),
    );

    const timeoutMs = 60000;

    const {result, timeout} = yield race({
      result: call(authorize, azureConfig),
      timeout: delay(timeoutMs),
    });

    if (timeout) {
      yield put(
        loggingActions.logWarning('Azure login timeout', {
          eventType: 'auth',
          timeout: timeoutMs,
        }),
      );
      yield put(
        actions.loginError({
          error: ['Login Timeout', 'Login is taking too long. Please retry.'],
        }),
      );
      return;
    }

    if (!result?.accessToken) {
      throw new Error('No access token received.');
    }

    const username = decodeJwt(result.accessToken);
    if (!username) {throw new Error('Token decode failed.');}

    yield put(
      loggingActions.logInfo('Azure login successful', {
        eventType: 'auth',
        username: username,
        authMethod: 'azure',
      }),
    );

    yield put(actions.loginUserWithoutPinAction(username));
    yield call(Keychain.setGenericPassword, 'authToken', result.accessToken);

    // Reset session context after saving credentials so future logs use the correct username
    resetSessionContext();
  } catch (error) {
    yield put(
      loggingActions.logError('Azure login failed', error, {
        eventType: 'auth',
        authMethod: 'azure',
      }),
    );
    const [errorMessage, errorDetail] = getAzureFriendlyError(error.message);
    yield put(actions.loginError({error: [errorMessage, errorDetail]}));
  } finally {
    yield put(actions.setLoading(false));
  }
}

function* loginWithoutPinSaga(payload) {
  try {
    yield put(actions.setLoading(true));

    yield put(
      loggingActions.logInfo('Login without PIN initiated', {
        eventType: 'auth',
        username: payload.userName,
        authMethod: 'azure_without_pin',
      }),
    );

    const response = yield call(authApi.loginWithoutPin, payload.userName);

    if (response.status === 200) {
      if (!response.data || typeof response.data !== 'object') {
        yield put(
          actions.loginError({
            error: [
              'Server Error',
              'API returned empty response. Please check backend server.',
            ],
          }),
        );
      } else if (
        response.data.result.errorText &&
        response.data.result.errorText !== 'Reset PIN'
      ) {
        yield put(
          loggingActions.logError(
            'Login without PIN failed',
            new Error(response.data.result.errorText),
            {
              eventType: 'auth',
              username: payload.userName,
              errorDetail: response.data.result.errorDetail,
            },
          ),
        );
        yield put(
          actions.loginError({
            error: [
              response.data.result.errorText,
              response.data.result.errorDetail,
            ],
          }),
        );
      } else {
        if (
          response.data &&
          response.data.result.errorText &&
          response.data.result.errorText === 'Reset PIN'
        ) {
          yield put(
            loggingActions.logInfo('PIN reset required', {
              eventType: 'auth',
              username: payload.userName,
            }),
          );
          yield call(navigate, {
            name: 'ChangePinScreen',
            param: {
              userName: payload.userName,
              oldPin: payload.userPin,
            },
          });
        } else {
          yield put(
            loggingActions.logInfo('Login without PIN successful', {
              eventType: 'auth',
              username: response.data.result.username,
              authMethod: 'azure_without_pin',
            }),
          );
          //set session
          yield put(actions.initializeSession(response.data));

          yield put(global.getUserStateRequest(response.data.result.username)); // Trigger getUserState saga
          yield put(global.getLocationListRequest()); // Trigger getLocationList saga
          yield put(global.getPartnerListRequest()); // Trigger getPartnerList saga
          yield put(actions.loginUserSuccess(response.data));

          // Reset session context after successful login so logs use fresh user data
          resetSessionContext();
        }
      }
    } else {
      yield put(
        actions.loginError({
          error: `Unexpected response status: ${response.status}`,
        }),
      );
    }
  } catch (e) {
    yield put(
      loggingActions.logError('Login without PIN exception', e, {
        eventType: 'auth',
        username: payload.userName,
      }),
    );
    const formattedError = formatError(e);
    yield put(
      actions.loginError({
        error: formattedError,
        errorText: formattedError,
      }),
    );
  } finally {
    yield put(actions.setLoading(false));
  }
}

function* loginSaga(payload) {
  try {
    yield put(actions.setLoading(true));

    yield put(
      loggingActions.logInfo('Login with PIN initiated', {
        eventType: 'auth',
        username: payload.userName,
        authMethod: 'pin',
      }),
    );

    const response = yield call(
      authApi.login,
      payload.userName,
      payload.userPin,
      payload.azureUserName,
    );

    if (response.status === 200) {
      if (!response.data || typeof response.data !== 'object') {
        yield put(
          actions.loginError({
            error: [
              'Unexpected error occurred',
              'Response format is invalid or empty.',
            ],
          }),
        );
      } else if (
        response.data.result.errorText &&
        response.data.result.errorText !== 'Reset PIN'
      ) {
        yield put(
          loggingActions.logError(
            'Login with PIN failed',
            new Error(response.data.result.errorText),
            {
              eventType: 'auth',
              username: payload.userName,
              errorDetail: response.data.result.errorDetail,
            },
          ),
        );
        yield put(
          actions.loginError({
            error: [
              response.data.result.errorText,
              response.data.result.errorDetail,
            ],
          }),
        );
      } else {
        if (
          response.data &&
          response.data.result.errorText &&
          response.data.result.errorText === 'Reset PIN'
        ) {
          yield put(
            loggingActions.logInfo('PIN reset required', {
              eventType: 'auth',
              username: payload.userName,
            }),
          );
          yield call(navigate, {
            name: 'ChangePinScreen',
            param: {
              userName: payload.userName,
              oldPin: payload.userPin,
            },
          });
        } else {
          yield put(
            loggingActions.logInfo('Login with PIN successful', {
              eventType: 'auth',
              username: response.data.result.username,
              authMethod: 'pin',
            }),
          );
          //set session
          yield put(actions.initializeSession(response.data));

          yield put(global.getUserStateRequest(response.data.result.username)); // Trigger getUserState saga

          yield put(global.getLocationListRequest()); // Trigger getLocationList saga
          yield put(global.getPartnerListRequest()); // Trigger getPartnerList saga
          yield put(actions.loginUserSuccess(response.data));

          // Reset session context after successful login so logs use fresh user data
          resetSessionContext();
        }
      }
    } else {
      yield put(
        actions.loginError({
          error: `Unexpected response status: ${response.status}`,
        }),
      );
    }
  } catch (e) {
    yield put(
      loggingActions.logError('Login with PIN exception', e, {
        eventType: 'auth',
        username: payload.userName,
      }),
    );
    const formattedError = formatError(e);
    yield put(
      actions.loginError({
        error: formattedError,
        errorText: formattedError,
      }),
    );
  } finally {
    yield put(actions.setLoading(false));
  }
}

function* changePinSaga(payload) {
  try {
    yield put(actions.setLoading(true));

    const response = yield call(
      authApi.changePin,
      payload.userName,
      payload.oldPin,
      payload.newPin,
    );
    if (response.status === 200) {
      if (!response.data || typeof response.data !== 'object') {
        yield put(
          actions.changePinError({
            error: [
              'Unexpected error occurred',
              'Response format is invalid or empty.',
            ],
          }),
        );
      } else if (response.data.result.info === 'PIN changed') {
        yield call(navigate, 'LoginScreen');
        yield put(actions.changePinSuccess(response.data.result.info));
      } else {
        yield put(
          actions.changePinError({
            error: [
              response.data.result.errorText,
              response.data.result.errorDetail,
            ],
          }),
        );
      }
    } else {
      yield put(
        actions.changePinError({
          error: `Unexpected response status: ${response.status}`,
        }),
      );
    }
  } catch (e) {
    const formattedError = formatError(e);
    yield put(
      actions.changePinError({
        error: formattedError,
        errorText: formattedError,
      }),
    );
  } finally {
    yield put(actions.setLoading(false));
  }
}

function* watchUserAuthentication() {
  yield takeLatest(types.AZURE_LOGIN, azureLoginSaga);
  yield takeLatest(types.LOGIN_USER_WITHOUT_PIN, loginWithoutPinSaga);
  yield takeLatest(types.LOGIN_USER, loginSaga);
  yield takeLatest(types.CHANGE_PIN_REQUEST, changePinSaga);
}

function* sessionExpire({userName}) {
  yield put(actions.setLoading(true));
  try {
    yield call(authApi.logout, userName);

    yield call(setSession, null);
    clearTokenTimeout();
    // Reset logging session context
    resetSessionContext();
    yield put(actions.sessionExpireSuccess());
    yield put(actions.clearStates());
  } catch (e) {
    const formattedError = formatError(e);
    yield put(
      actions.loginError({
        error: formattedError,
        errorText: formattedError,
      }),
    );
  } finally {
    yield put(actions.setLoading(false));
  }
}
function* logout({userName}) {
  yield put(actions.setLoading(true));

  try {
    const credentials = yield call(Keychain.getGenericPassword);

    if (credentials) {
      // Call the revoke function with proper arguments
      yield call(revoke, azureConfig, {
        tokenToRevoke: credentials.password,
        clientId: azureConfig.clientId,
        revocationEndpoint: azureConfig.serviceConfiguration.revocationEndpoint,
      });

      // Reset the keychain only after successful token revocation
      yield call(Keychain.resetGenericPassword);

      // Call logout API
      yield call(authApi.logout, userName);
      clearTokenTimeout();
      // Clear session and update the state
      yield call(setSession, null);
      // Reset logging session context
      resetSessionContext();
      yield put(actions.logoutSuccess());
      yield put(actions.clearStates());
    } else {
      throw new Error('No credentials found');
    }
  } catch (e) {
    const formattedError = formatError(e);
    yield put(
      actions.loginError({
        error: formattedError,
        errorText: formattedError,
      }),
    );
  } finally {
    yield put(actions.setLoading(false));
  }
}

function* watchLogoutRequest() {
  yield takeEvery(types.LOGOUT_REQUEST, logout);
  yield takeEvery(types.SESSION_EXPIRE_REQUEST, sessionExpire);
}

const authSagas = [
  fork(watchInitSession),
  fork(watchUserAuthentication),
  fork(watchLogoutRequest),
];

export default authSagas;
