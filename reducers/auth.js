import * as types from '../actions';

const INITIAL_STATE = {
  token: null,
  user: null,
  homeScreen: null,
  isAuthenticated: false,
  isInitialized: false,
  error: null,
  message: null,
  loading: false,
  timeout: null,
  currentPage: null,
  status: null,
  errorText: null,
};

export default function auth(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.TEST_API_SUCCESS: {
      return {
        ...state,
        status: action.payload.status,
        errorText: null,
      };
    }
    case types.TEST_API_ERROR: {
      return {
        ...state,
        status: action.payload.status,
        error: action.payload.error,
        errorText: action.payload.errorText,
      };
    }
    case types.AZURE_LOGIN: {
      return {
        ...state,
        status: null,
        error: null,
        errorText: null,
      };
    }
    case types.INITIAL: {
      return {
        ...state,
        isInitialized: true,
        isAuthenticated: false,
        timeout: action.payload.timeout,
        errorText: null,
      };
    }

    case types.CHANGE_PIN_SUCCESS: {
      return {
        ...state,
        message: action.payload.data,
        error: null,
        errorText: null,
      };
    }

    case types.LOGIN_USER_SUCCESS: {
      return {
        ...state,
        currentPage: action.payload.data.result.currentPage,
        user: action.payload.data.result,
        homeScreen: action.payload.data.buttons,
        isAuthenticated: true,
        isInitialized: true,
        status: null,
        error: null,
        errorText: null,
      };
    }

    case types.SESSION_EXPIRE_SUCCESS: {
      return {
        ...state,
        isAuthenticated: false,
        isInitialized: true,
        user: null,
        homeScreen: null,
        timeout: true,
        errorText: null,
      };
    }
    case types.LOGOUT_SUCCESS: {
      return {
        ...state,
        isAuthenticated: false,
        isInitialized: true,
        user: null,
        homeScreen: null,
        timeout: null,
        errorText: null,
      };
    }

    case types.LOGIN_USER_ERROR: {
      return {
        ...state,
        error: action.payload.error,
        errorText: action.payload.errorText,
      };
    }
    case types.CHANGE_PIN_ERROR: {
      return {
        ...state,
        error: action.payload.error,
        errorText: action.payload.errorText,
      };
    }

    case types.SET_LOADING: {
      return {
        ...state,
        loading: action.payload.loading,
      };
    }
    case types.CLEAR_MESSAGE: {
      return {
        ...state,
        message: null,
      };
    }
    case types.CLEAR_ERROR: {
      return {
        ...state,
        error: null,
      };
    }
    default: {
      return state;
    }
  }
}
