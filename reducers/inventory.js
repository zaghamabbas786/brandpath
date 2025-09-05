import * as types from '../actions';

const INITIAL_STATE = {
  startStockMove: false,
  stockMoveDetail: null,
  extraInfo: null,
  conformMove: false,
  conformSetMasterLoc: false,
  setMasterLocText: '',
};

export default function global(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.GET_START_STOCK_MOVE_SUCCESS: {
      return {
        ...state,
        startStockMove: true,
        stockMoveDetail: null,
        extraInfo: null,
        conformMove: false,
        conformSetMasterLoc: false,
        setMasterLocText: '',
      };
    }

    case types.GET_STOCK_MOVE_DETAIL_SUCCESS: {
      return {
        ...state,
        stockMoveDetail: action.payload.data,
        extraInfo: action.payload.extrainfo, // Store the plain text
      };
    }
    case types.CONFORM_MOVE_TO_MASTER_LOC: {
      return {
        ...state,
        conformMove: true,
        setMasterLocText: action.payload.text,
      };
    }
    case types.GET_SET_MASTER_LOC_SUCCESS: {
      return {
        ...state,
        conformSetMasterLoc: true,
      };
    }
    case types.GET_MASTER_LOC_SUCCESS:
    case types.GET_CANCLE_STOCK_MOVE_SUCCESS: {
      return {
        ...state,
        stockMoveDetail: null,
        extraInfo: null,
        conformMove: false,
        conformSetMasterLoc: false,
        setMasterLocText: '',
      };
    }
    case types.CLEAR_STATES:
    case types.CLEAR_STOCK_MOVE: {
      return {
        ...state,
        startStockMove: false,
        stockMoveDetail: null,
        extraInfo: null,
        conformMove: false,
        conformSetMasterLoc: false,
        setMasterLocText: '',
      };
    }

    default: {
      return state;
    }
  }
}
