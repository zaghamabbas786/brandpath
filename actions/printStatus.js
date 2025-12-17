import * as types from './index';

export const setPrintStatus = (code) => ({
  type: types.SET_PRINT_STATUS,
  payload: code,
});

export const clearPrintStatus = () => ({
  type: types.CLEAR_PRINT_STATUS,
});
