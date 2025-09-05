import * as types from './index';

export const getEscalationPrintRequest = data => ({
  type: types.GET_ESCALATION_PRINT_REQUEST,
  data,
});

export const getEscalationPrintSuccess = data => ({
  type: types.GET_ESCALATION_PRINT_SUCCESS,
  payload: {data},
});

export const clearStates = () => ({
  type: types.CLEAR_STATES,
});
