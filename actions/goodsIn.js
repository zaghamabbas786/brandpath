import * as types from './index';
export const getDockToStockRequest = (username, search = '') => ({
  type: types.GET_DOCK_TO_STOCK_REQUEST,
  username,
  search,
});

export const getDockToStockSuccess = data => ({
  type: types.GET_DOCK_TO_STOCK_SUCCESS,
  payload: {data},
});

export const setDocDataLogRequest = (
  UserName,
  PoNum,
  PoDate,
  TrackingNumber,
) => ({
  type: types.SET_DOC_DATA_LOG_REQUEST,
  UserName,
  PoNum,
  PoDate,
  TrackingNumber,
});

export const setDocDataLogSuccess = data => ({
  type: types.SET_DOC_DATA_LOG_SUCCESS,
  payload: {data},
});

export const resetDockToStock = () => ({
  type: types.RESET_DOCK_TO_STOCK,
});

export const clearStates = () => ({
  type: types.CLEAR_STATES,
});
