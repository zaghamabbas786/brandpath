import {call, put, fork, takeLatest} from 'redux-saga/effects';
import * as types from '../actions';
import * as globalActions from '../actions/global';
import * as actions from '../actions/inventory';
import * as inventory from '../api/inventoryControl';
import {formatError} from '../utils/errorHandler';

// Start stock move
function* fetchStartStockMove({userName}) {
  try {
    yield put(globalActions.setLoading(true));

    const response = yield call(inventory.startStockMove, userName);
    if (response.status === 200) {
      yield put(actions.getStartSTockMoveSuccess(response.data));
    } else {
      throw new Error('Unable to start stock move.');
    }
  } catch (e) {
    const formattedError = formatError(e);
    yield put(
      globalActions.getScreenError({
        error: formattedError,
        errorText: formattedError,
      }),
    );
  } finally {
    yield put(globalActions.setLoading(false));
  }
}

function* watchStartStockMove() {
  yield takeLatest(types.GET_START_STOCK_MOVE_REQUEST, fetchStartStockMove);
}

//Set stock move master location
function* fetchSetMasterLoc({userName}) {
  try {
    yield put(globalActions.setLoading(true));

    const response = yield call(inventory.setMasterLoc, userName);
    if (response.data.action === 'MOVECOMPLETE') {
      yield put(actions.getSetMasterLocSuccess(response.data));
    } else {
      throw new Error('Unable to set master location.');
    }
  } catch (e) {
    const formattedError = formatError(e);
    yield put(
      globalActions.getScreenError({
        error: formattedError,
        errorText: formattedError,
      }),
    );
  } finally {
    yield put(globalActions.setLoading(false));
  }
}

function* watchSetMasterLoc() {
  yield takeLatest(types.GET_SET_MASTER_LOC_REQUEST, fetchSetMasterLoc);
}

// Set Stock Quantity
function* fetchStockMoveQty({userName, qty}) {
  const processError = function* (error) {
    yield put(
      globalActions.barCodeError({
        error,
      }),
    );
  };

  try {
    yield put(globalActions.setLoading(true));

    const response = yield call(inventory.setStockMoveQty, userName, qty);

    if (response.data.errText || response.data.errDetail) {
      yield processError([`Unexpected response status: ${response.status}`]);
    } else {
      const stockMoveDetail = yield call(
        inventory.getStockMoveDetail,
        userName,
      );
      if (response.status === 200) {
        yield put(
          actions.getStockMoveDetailSuccess({
            data: stockMoveDetail.data,
            extrainfo: null,
          }),
        );
      } else {
        yield processError([`Unexpected response status: ${response.status}`]);
      }
    }
  } catch (e) {
    const formattedError = formatError(e);
    yield put(
      globalActions.getScreenError({
        error: formattedError,
        errorText: formattedError,
      }),
    );
  } finally {
    yield put(globalActions.setLoading(false));
  }
}

function* watchStockMoveQty() {
  yield takeLatest(types.GET_STOCK_MOVE_QTY_REQUEST, fetchStockMoveQty);
}

// Get master location(second cancle)
function* fetchGetMasterLoc({userName}) {
  try {
    yield put(globalActions.setLoading(true));

    const response = yield call(inventory.getMasterLoc, userName);

    if (response.data.action === 'MOVECOMPLETE') {
      yield put(actions.getMasterLocSuccess(response.data));
      yield put(actions.getStartStockMoveRequest(userName));
    } else {
      throw new Error('Unable to get master location.');
    }
  } catch (e) {
    const formattedError = formatError(e);
    yield put(
      globalActions.getScreenError({
        error: formattedError,
        errorText: formattedError,
      }),
    );
  } finally {
    yield put(globalActions.setLoading(false));
  }
}

function* watchGetMasterLoc() {
  yield takeLatest(types.GET_MASTER_LOC_REQUEST, fetchGetMasterLoc);
}

// Cancle stock move
function* fetchCancleStockMove({userName}) {
  try {
    yield put(globalActions.setLoading(true));

    const response = yield call(inventory.cancelStockMove, userName);

    if (response.data.action === 'MOVECANCELLED') {
      yield put(actions.getCancleSTockMoveSuccess(response.data));
      yield put(actions.getStartStockMoveRequest(userName));
    } else {
      throw new Error('Unable to cancle stock move.');
    }
  } catch (e) {
    const formattedError = formatError(e);
    yield put(
      globalActions.getScreenError({
        error: formattedError,
        errorText: formattedError,
      }),
    );
  } finally {
    yield put(globalActions.setLoading(false));
  }
}

function* watchCancleStockMove() {
  yield takeLatest(types.GET_CANCLE_STOCK_MOVE_REQUEST, fetchCancleStockMove);
}

const globalSagas = [
  fork(watchStartStockMove),
  fork(watchStockMoveQty),
  fork(watchSetMasterLoc),
  fork(watchCancleStockMove),
  fork(watchGetMasterLoc),
];

export default globalSagas;
