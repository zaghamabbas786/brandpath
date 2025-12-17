import * as types from './index';
export const setDispEnvAction = data => ({
  type: types.SET_DISP_ENV_REQUEST,
  data,
});

export const setDispEnvSuccess = data => ({
  type: types.SET_DISP_ENV_SUCCESS,
  payload: {
    data,
  },
});
export const barCodeReset = () => ({
  type: types.BAR_CODE_RESET,
});
export const barCodeAction = data => ({
  type: types.BAR_CODE_ACTION,
  data,
});

export const barCodeSuccess = data => ({
  type: types.BAR_CODE_SUCCESS,
  payload: {
    data,
    page: 'BARCODE',
  },
});

export const getUserStateRequest = username => ({
  type: types.GET_USER_STATE_REQUEST,
  payload: {username},
});

export const getUserStateSuccess = data => ({
  type: types.GET_USER_STATE_SUCCESS,
  payload: {data},
});

export const getLocationListRequest = () => ({
  type: types.GET_LOCATION_LIST_REQUEST,
});

export const getLocationListSuccess = locations => ({
  type: types.GET_LOCATION_LIST_SUCCESS,
  payload: {locations},
});

export const getPartnerListRequest = () => ({
  type: types.GET_PARTNER_LIST_REQUEST,
});

export const getPartnerListSuccess = partners => ({
  type: types.GET_PARTNER_LIST_SUCCESS,
  payload: {partners},
});

export const setDispEnvError = ({error, errorText}) => ({
  type: types.SET_DISP_ENV_ERROR,
  payload: {
    error,
    errorText,
  },
});
export const barCodeError = ({error, errorText}) => ({
  type: types.BAR_CODE_ERROR,
  payload: {
    error,
    errorText,
  },
});

//screens
export const getScreenRequest = url => ({
  type: types.GET_SCREEN_REQUEST,
  payload: {url},
});

export const getScreenRequestData = (userName, url) => ({
  type: types.GET_SCREEN_REQUEST_DATA,
  userName,
  url,
});

export const getButtonScreenSuccess = data => ({
  type: types.GET_BUTTON_SCREEN_SUCCESS,
  payload: {data},
});

export const getScreenSuccess = data => ({
  type: types.GET_SCREEN_SUCCESS,
  payload: {data},
});

export const getScreenError = ({error, errorText}) => ({
  type: types.GET_SCREEN_ERROR,
  payload: {
    error,
    errorText,
  },
});

export const getLocalCurrentScreen = screen => ({
  //to store local screen names like XDOCK and GOOGLE.INBOUND so we can send these as page name
  type: types.GET_LOCAL_CURRENT_SCREEN,
  payload: {screen},
});

export const goBack = () => ({
  type: types.GO_BACK,
});

export const setLoading = loading => ({
  type: types.SET_LOADING_GLOBAL,
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

export const getShippingListRequest = userName => ({
  type: types.GET_SHIPPING_LIST_REQUEST,
  payload: {userName},
});

export const getShippingListSuccess = shippingList => ({
  type: types.GET_SHIPPING_LIST_SUCCESS,
  payload: {shippingList},
});

export const getShippingListError = ({error, errorText}) => ({
  type: types.GET_SHIPPING_LIST_ERROR,
  payload: {error, errorText},
});

export const setShippingTypeRequest = (userName, courierName) => ({
  type: types.SET_SHIPPING_TYPE_REQUEST,
  payload: {userName, courierName},
});

export const setShippingTypeSuccess = (message, courierName) => ({
  type: types.SET_SHIPPING_TYPE_SUCCESS,
  payload: {message, courierName},
});

export const setShippingTypeError = ({error, errorText}) => ({
  type: types.SET_SHIPPING_TYPE_ERROR,
  payload: {error, errorText},
});

export const getDispatchListRequest = userName => ({
  type: types.GET_DISPATCH_LIST_REQUEST,
  payload: {userName},
});

export const getDispatchListSuccess = dispatchList => ({
  type: types.GET_DISPATCH_LIST_SUCCESS,
  payload: {dispatchList},
});

export const getDispatchListError = ({error, errorText}) => ({
  type: types.GET_DISPATCH_LIST_ERROR,
  payload: {error, errorText},
});

export const getOrderDetailRequest = (userName, orderRef) => ({
  type: types.GET_ORDER_DETAIL_REQUEST,
  payload: {userName, orderRef},
});

export const getOrderDetailSuccess = orderDetail => ({
  type: types.GET_ORDER_DETAIL_SUCCESS,
  payload: {orderDetail},
});

export const getOrderDetailError = ({error, errorText}) => ({
  type: types.GET_ORDER_DETAIL_ERROR,
  payload: {error, errorText},
});

export const setDispatchRefNumber = refNumber => ({
  type: types.SET_DISPATCH_REF_NUMBER,
  payload: {refNumber},
});

export const clearDispatchRefNumber = () => ({
  type: types.CLEAR_DISPATCH_REF_NUMBER,
});
