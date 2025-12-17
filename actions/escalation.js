import * as types from './index';

export const getEscalationPrintRequest = data => {
  console.log('📤 getEscalationPrintRequest action creator called with data:', JSON.stringify(data, null, 2));
  const action = {
    type: types.GET_ESCALATION_PRINT_REQUEST,
    data,
  };
  console.log('📤 Dispatching action:', JSON.stringify(action, null, 2));
  return action;
};

export const getEscalationPrintSuccess = data => ({
  type: types.GET_ESCALATION_PRINT_SUCCESS,
  payload: {data},
});

export const clearStates = () => ({
  type: types.CLEAR_STATES,
});
