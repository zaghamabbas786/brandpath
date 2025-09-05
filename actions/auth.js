import * as types from './index';

export const testApiRequest = () => ({
  type: types.TEST_API_REQUEST,
});

export const testApiSuccess = status => ({
  type: types.TEST_API_SUCCESS,
  payload: {
    status,
  },
});

export const testApiError = ({error, errorText, status}) => ({
  type: types.TEST_API_ERROR,
  payload: {
    error,
    errorText,
    status,
  },
});

export const initial = timeout => ({
  type: types.INITIAL,
  payload: {
    timeout,
  },
});

export const initializeSession = data => ({
  type: types.INITIALIZE_SESSION,
  payload: {
    data,
  },
});

export const azureLoginAction = () => ({
  type: types.AZURE_LOGIN,
});

export const loginUserWithoutPinAction = userName => ({
  type: types.LOGIN_USER_WITHOUT_PIN,
  userName,
});

export const loginUserAction = (userName, userPin, azureUserName) => ({
  type: types.LOGIN_USER,
  userName,
  userPin,
  azureUserName,
});

export const loginUserSuccess = data => ({
  type: types.LOGIN_USER_SUCCESS,
  payload: {
    data,
  },
});

export const changePinAction = (userName, oldPin, newPin) => ({
  type: types.CHANGE_PIN_REQUEST,
  userName,
  oldPin,
  newPin,
});

export const changePinSuccess = data => ({
  type: types.CHANGE_PIN_SUCCESS,
  payload: {
    data,
  },
});

export const logoutRequest = userName => ({
  type: types.LOGOUT_REQUEST,
  userName,
});

export const logoutSuccess = () => ({type: types.LOGOUT_SUCCESS});

export const sessionExpireRequest = userName => ({
  type: types.SESSION_EXPIRE_REQUEST,
  userName,
});

export const sessionExpireSuccess = () => ({
  type: types.SESSION_EXPIRE_SUCCESS,
});

export const loginError = ({error, errorText}) => ({
  type: types.LOGIN_USER_ERROR,
  payload: {
    error,
    errorText,
  },
});
export const changePinError = ({error, errorText}) => ({
  type: types.CHANGE_PIN_ERROR,
  payload: {
    error,
    errorText,
  },
});

export const setLoading = loading => ({
  type: types.SET_LOADING,
  payload: {
    loading,
  },
});
export const clearMessage = () => ({
  type: types.CLEAR_MESSAGE,
});

export const clearError = () => ({
  type: types.CLEAR_ERROR,
});

export const clearStates = () => ({
  type: types.CLEAR_STATES,
});
