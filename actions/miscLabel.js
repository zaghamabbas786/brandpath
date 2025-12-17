import * as types from './index';

export const getMiscLabelPrintRequest = data => ({
  type: types.GET_MISC_LABEL_PRINT_REQUEST,
  data,
});

export const getMiscLabelPrintSuccess = data => ({
  type: types.GET_MISC_LABEL_PRINT_SUCCESS,
  payload: {data},
});

