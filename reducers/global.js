import * as types from '../actions';
const INITIAL_STATE = {
  userState: null,
  locationList: [],
  partnerList: [],
  barCode: null,
  globalLoading: false,
  error: null,
  message: null,
  globalCurrentPage: null,
  screenDetail: null,
  screenHistoryUrl: [],
  currentUrl: null,
  localCurrentPage: null,
  errorText: null,
};

export default function global(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.GET_SCREEN_REQUEST: {
      return {
        ...state,
        screenDetail: null,
        currentUrl: action.payload.url,
        screenHistoryUrl: state.screenHistoryUrl.includes(action.payload.url)
          ? state.screenHistoryUrl
          : [...state.screenHistoryUrl, action.payload.url],
        error: null,
        errorText: null,
      };
    }
    case types.GET_SCREEN_SUCCESS: {
      return {
        ...state,
        screenDetail: action.payload.data,
        error: null,
        errorText: null,
      };
    }
    case types.GET_BUTTON_SCREEN_SUCCESS: {
      return {
        ...state,
        globalCurrentPage: action.payload.data.result.currentPage,
        screenDetail: action.payload.data.buttons,

        error: null,
        errorText: null,
      };
    }
    case types.GO_BACK: {
      if (state.screenHistoryUrl.length > 0) {
        const updatedHistory = state.screenHistoryUrl.slice(0, -1); // Remove the last URL immutably

        const previousScreen =
          updatedHistory.length > 0
            ? updatedHistory[updatedHistory.length - 1]
            : null; // Get the previous URL

        return {
          ...state,
          screenHistoryUrl: updatedHistory, // Update the history with the popped array
          currentUrl: previousScreen, // Set currentPage to the previous screen
          screenDetail: null, // Reset screenDetail to null
          globalCurrentPage: null,
          barCode: null,
          localCurrentPage: null,
          errorText: null,
        };
      }

      return {
        ...state,
        screenDetail: null,
        barCode: null,
        globalCurrentPage: null, // Ensure globalCurrentPage is cleared
        localCurrentPage: null,
        errorText: null,
      };
    }

    case types.GET_SCREEN_ERROR: {
      return {
        ...state,
        screenDetail: null,
        error: action.payload.error,
        errorText: action.payload.errorText,
      };
    }

    case types.SET_DISP_ENV_SUCCESS: {
      return {
        ...state,
        message: action.payload.data,
        error: null,
        errorText: null,
      };
    }
    case types.BAR_CODE_RESET: {
      return {
        ...state,
        errorText: null,
        barCode: null,
      };
    }
    case types.BAR_CODE_SUCCESS: {
      return {
        ...state,
        screenHistoryUrl: state.screenHistoryUrl.includes(action.payload.page)
          ? state.screenHistoryUrl
          : [...state.screenHistoryUrl, action.payload.page],
        globalCurrentPage: action.payload.data.barcodeResult.currentPage,
        barCode: action.payload.data.barcodeResult,
        message: action.payload.data.message,
        error: null,
        errorText: null,
      };
    }

    case types.GET_ESCALATION_PRINT_SUCCESS: {
      return {
        ...state,
        message: action.payload.data,
        error: null,
        errorText: null,
      };
    }

    case types.GET_LOCAL_CURRENT_SCREEN: {
      return {
        ...state,
        localCurrentPage: action.payload.screen,
      };
    }
    case types.GET_USER_STATE_SUCCESS: {
      return {
        ...state,
        userState: action.payload.data,
      };
    }
    case types.GET_LOCATION_LIST_SUCCESS: {
      return {
        ...state,
        locationList: action.payload.locations,
      };
    }
    case types.GET_PARTNER_LIST_SUCCESS: {
      return {
        ...state,
        partnerList: action.payload.partners,
      };
    }
    case types.SET_DISP_ENV_ERROR: {
      return {
        ...state,
        error: action.payload.error,
        errorText: action.payload.errorText,
      };
    }
    case types.BAR_CODE_ERROR: {
      return {
        ...state,
        error: action.payload.error,
        errorText: action.payload.errorText,
      };
    }
    case types.SET_LOADING_GLOBAL: {
      return {
        ...state,
        globalLoading: action.payload.loading,
      };
    }
    case types.SET_DOC_DATA_LOG_SUCCESS: {
      return {
        ...state,
        message: action.payload.data,
        error: null,
        errorText: null,
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
    case types.CLEAR_STATES: {
      return {
        ...state,
        userState: null,
        locationList: [],
        partnerList: [],
        barCode: null,
        globalLoading: false,
        error: null,
        errorText: null,
        message: null,
        globalCurrentPage: null,
        screenDetail: null,
        screenHistoryUrl: [],
        currentUrl: null,
        localCurrentPage: null,
      };
    }
    default: {
      return state;
    }
  }
}
