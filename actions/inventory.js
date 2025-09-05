import * as types from './index';

export const getStartStockMoveRequest = userName => ({
  type: types.GET_START_STOCK_MOVE_REQUEST,
  userName,
});

export const getStartSTockMoveSuccess = data => ({
  type: types.GET_START_STOCK_MOVE_SUCCESS,
  payload: {data},
});

export const getSetMasterLocRequest = userName => ({
  type: types.GET_SET_MASTER_LOC_REQUEST,
  userName,
});

export const getSetMasterLocSuccess = data => ({
  type: types.GET_SET_MASTER_LOC_SUCCESS,
  payload: {data},
});

export const clearStockMove = () => ({
  type: types.CLEAR_STOCK_MOVE,
});

export const getStockMoveQtyRequest = (userName, qty) => ({
  type: types.GET_STOCK_MOVE_QTY_REQUEST,
  userName,
  qty,
});

export const getStockMoveQtySuccess = data => ({
  type: types.GET_STOCK_MOVE_QTY_SUCCESS,
  payload: {data},
});

export const getStockMoveDetailSuccess = payload => ({
  type: types.GET_STOCK_MOVE_DETAIL_SUCCESS,
  payload,
});

export const conformMoveToMasterLoc = text => ({
  type: types.CONFORM_MOVE_TO_MASTER_LOC,
  payload: {text},
});

export const getMasterLocRequest = userName => ({
  type: types.GET_MASTER_LOC_REQUEST,
  userName,
});

export const getMasterLocSuccess = data => ({
  type: types.GET_MASTER_LOC_SUCCESS,
  payload: {data},
});
export const getCancleStockMoveRequest = userName => ({
  type: types.GET_CANCLE_STOCK_MOVE_REQUEST,
  userName,
});

export const getCancleSTockMoveSuccess = data => ({
  type: types.GET_CANCLE_STOCK_MOVE_SUCCESS,
  payload: {data},
});

export const clearStates = () => ({
  type: types.CLEAR_STATES,
});
