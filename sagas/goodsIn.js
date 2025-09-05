import {call, put, fork, takeLatest} from 'redux-saga/effects';
import * as types from '../actions';
import * as actions from '../actions/goodsIn';
import * as globalActions from '../actions/global';
import * as goodsIn from '../api/goodsIn';
import {formatError} from '../utils/errorHandler';

// Fetch screen data
function* fetchDockToStock({username, search}) {
  try {
    yield put(globalActions.setLoading(true));

    const response = yield call(goodsIn.getDockToStock, username, search);

    yield put(actions.getDockToStockSuccess(response.data));
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

function* watchDockToStock() {
  yield takeLatest(types.GET_DOCK_TO_STOCK_REQUEST, fetchDockToStock);
}

//Set doc data log
function* fetchSetDocDataLog({UserName, PoNum, PoDate, TrackingNumber}) {
  try {
    yield put(globalActions.setLoading(true));

    const response = yield call(
      goodsIn.setDocDataLog,
      UserName,
      PoNum,
      PoDate,
      TrackingNumber,
    );

    if (response.status === 200) {
      yield put(
        actions.setDocDataLogSuccess(`PO # ${PoNum} is booked successfully!`),
      );
    } else {
      yield put(
        actions.getScreenError({
          error: `Unexpected response status: ${response.status}`,
        }),
      );
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

function* watchSetDocData() {
  yield takeLatest(types.SET_DOC_DATA_LOG_REQUEST, fetchSetDocDataLog);
}

const globalSagas = [fork(watchDockToStock), fork(watchSetDocData)];

export default globalSagas;
