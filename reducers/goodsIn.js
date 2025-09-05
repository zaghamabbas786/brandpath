import * as types from '../actions';
const INITIAL_STATE = {
  dockToStockList: null,
};

export default function global(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.GET_DOCK_TO_STOCK_SUCCESS: {
      return {
        ...state,
        dockToStockList: action.payload.data,
      };
    }
    case types.RESET_DOCK_TO_STOCK: {
      return {
        ...state,
        dockToStockList: null,
      };
    }
    case types.CLEAR_STATES: {
      return {
        ...state,
        dockToStockList: null,
      };
    }

    default: {
      return state;
    }
  }
}
