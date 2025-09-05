import {select, call, put, fork, takeLatest} from 'redux-saga/effects';
import * as types from '../actions';
import * as actions from '../actions/global';
import * as goodsInActions from '../actions/goodsIn';
import * as auth from '../actions/auth';
import * as inventory from '../actions/inventory';
import * as globalApi from '../api/global';
import * as inventoryApi from '../api/inventoryControl';
import {setSession} from '../auth/utils';
import {navigate, navigateBack} from '../utils/navigate';
import * as goodsIn from '../api/goodsIn';
import * as inventoryControl from '../api/inventoryControl';
import {formatError} from '../utils/errorHandler';

function* setDispEnvSaga(payload) {
  try {
    yield put(actions.setLoading(true));

    const response = yield call(
      globalApi.setDispEnv,
      payload.data.userName,
      payload.data.stationID,
      payload.data.partnerKey,
    );
    if (response.status === 200) {
      if (response.data) {
        yield put(
          actions.setDispEnvError({
            error: ['Unexpected error occurred', response.data],
          }),
        );
      }
      yield put(actions.getUserStateRequest(payload.data.userName));
      yield put(actions.setDispEnvSuccess('Value changed successfully!'));
    } else {
      yield put(
        actions.setDispEnvError({
          error: `Unexpected response status: ${response.status}`,
        }),
      );
    }
  } catch (e) {
    const formattedError = formatError(e);
    yield put(
      actions.setDispEnvError({
        error: formattedError,
        errorText: formattedError,
      }),
    );
  } finally {
    yield put(actions.setLoading(false));
  }
}

function* watchUserSetDispRequest() {
  yield takeLatest(types.SET_DISP_ENV_REQUEST, setDispEnvSaga);
}

function* barCodeSaga(payload) {
  try {
    yield put(actions.setLoading(true));

    const {currentPage, userName, barcode, page} = payload.data;

    // Utility function to handle common response logic
    const handleResponse = function* (response) {
      if (!response.data || typeof response.data !== 'object') {
        yield processError([
          'Unexpected error occurred',
          'Response format is invalid or empty.',
        ]);
      } else if (response.data.errText || response.data.errDetail) {
        //i have added this if logic for the screens where we get extrainfo with error but the page type will be barcode , mostly used for scan screens
        if (
          response.data.extraInfo &&
          currentPage !== 'CMD.PBUILDER' &&
          currentPage !== 'CMD.PPICK' &&
          currentPage !== 'CMD.CBUILDER' &&
          currentPage !== 'CMD.RET.RTS' &&
          currentPage !== 'STOCKMOVE' &&
          currentPage !== 'CMD.ESCALATION' &&
          currentPage !== 'CMD.GOOGLE.INBOUND' &&
          currentPage !== 'CMD.ACCESSCONTROL'
        ) {
          // Navigate to the screen with the provided data

          yield put(
            actions.barCodeSuccess({
              barcodeResult: response.data,
            }),
          );

          yield call(navigate, 'ScanDetailScreen');
        } else if (
          response.data.extraInfo &&
          (currentPage === 'CMD.GOOGLE.INBOUND' || currentPage === 'CMD.PPICK')
        ) {
          yield put(actions.getScreenSuccess(response.data));
          yield put(actions.getLocalCurrentScreen(response.data.page));
        }

        // Handle the error as usual
        yield processError([response.data.errText, response.data.errDetail]);
      } else if (
        response.data.barcode.toLowerCase() === 'cmd.back' &&
        response.data.extraInfo === ''
      ) {
        yield put(inventory.clearStockMove());
        yield put(actions.goBack());
        yield put(goodsInActions.resetDockToStock());
        yield call(navigateBack);
      } else {
        if (
          currentPage === 'CMD.REPLEN.LIST' ||
          currentPage === 'CMD.ITEMINFORMATION' ||
          currentPage === 'CMD.PBUILDER' ||
          currentPage === 'CMD.CBUILDER' ||
          currentPage === 'CMD.PPICK' ||
          currentPage === 'CMD.RET.RTS' ||
          currentPage === 'CMD.ESCALATION' ||
          currentPage === 'CMD.GOOGLE.INBOUND' ||
          currentPage === 'CMD.ACCESSCONTROL'
        ) {
          yield put(actions.getScreenSuccess(response.data));
          if (
            currentPage === 'CMD.PBUILDER' ||
            currentPage === 'CMD.PPICK' ||
            currentPage === 'CMD.ITEMINFORMATION' ||
            currentPage === 'CMD.CBUILDER' ||
            currentPage === 'CMD.RET.RTS' ||
            currentPage === 'CMD.ESCALATION' ||
            currentPage === 'CMD.GOOGLE.INBOUND' ||
            currentPage === 'CMD.ACCESSCONTROL'
          ) {
            yield put(actions.getLocalCurrentScreen(response.data.page));
          }
        } else if (currentPage === 'STOCKMOVE') {
          const stockMoveDetail = yield call(
            inventoryApi.getStockMoveDetail,
            userName,
          );

          if (stockMoveDetail.status === 200) {
            const conformMove = yield select(
              state => state.Inventory.conformMove,
            );

            yield put(
              inventory.getStockMoveDetailSuccess({
                data: stockMoveDetail.data,
                extrainfo: conformMove ? response.data.extraInfo : null,
              }),
            );
          } else {
            yield processError([
              `Unexpected response status: ${response.status}`,
            ]);
          }
        } else {
          yield put(
            actions.barCodeSuccess({
              barcodeResult: response.data,
              message: 'Scanned successfully!',
            }),
          );
          if (
            response.data.page === 'ACCESSCONTROL' ||
            response.data.page === 'ITEMINFORMATION'
          ) {
            yield put(actions.getLocalCurrentScreen(response.data.page));
          }

          yield call(navigate, 'ScanDetailScreen');
        }
      }
    };

    // Utility function to process errors
    const processError = function* (error) {
      yield put(
        actions.barCodeError({
          error,
        }),
      );
    };

    if (currentPage === 'dock_to_stock') {
      const response = yield call(goodsIn.getDockToStock, userName, barcode);
      yield put(goodsInActions.getDockToStockSuccess(response.data));
    } else if (currentPage === 'STOCKMOVE') {
      const response = yield call(
        globalApi.scanBarcode,
        userName,
        currentPage,
        barcode,
      );

      if (response.status === 200) {
        yield* handleResponse(response);
      } else {
        yield processError([`Unexpected response status: ${response.status}`]);
      }
    } else if (
      currentPage === 'security_check' &&
      barcode.toLowerCase() !== 'cmd.back'
    ) {
      const response = yield call(
        inventoryControl.getSecurityCheck,
        userName,
        barcode,
      );

      if (response.status === 200) {
        yield* handleResponse(response);
      } else {
        yield processError([`Unexpected response status: ${response.status}`]);
      }
    } else {
      const response = yield call(
        globalApi.scanBarcode,
        userName,
        page,
        barcode,
      );

      if (response.status === 200) {
        yield* handleResponse(response);
      } else {
        yield processError([`Unexpected response status: ${response.status}`]);
      }
    }
  } catch (e) {
    const formattedError = formatError(e);
    yield put(
      actions.barCodeError({
        error: formattedError,
        errorText: formattedError,
      }),
    );
  } finally {
    yield put(actions.setLoading(false));
  }
}

function* watchUserBarCodeRequest() {
  yield takeLatest(types.BAR_CODE_ACTION, barCodeSaga);
}

// Fetch user state
function* fetchUserState({username}) {
  try {
    const response = yield call(globalApi.getUserState, username);

    if (response.status === 204) {
      yield call(setSession, null);

      yield put(auth.logoutRequest(username));

      yield put(
        auth.loginError({
          error: ['Unexpected error occurred', 'Unable to fetch user state'],
        }),
      );
    } else {
      yield put(actions.getUserStateSuccess(response.data));
    }
  } catch (e) {
    yield call(setSession, null);
    yield put(auth.logoutRequest(username));
    const formattedError = formatError(e);
    yield put(
      auth.loginError({
        error: formattedError,
        errorText: formattedError,
      }),
    );
  }
}

function* watchUserStateRequest() {
  yield takeLatest(types.GET_USER_STATE_REQUEST, fetchUserState);
}

// Fetch location list
function* fetchLocationList() {
  try {
    const response = yield call(globalApi.getLocationList);

    yield put(actions.getLocationListSuccess(response.data));
  } catch (e) {
    const formattedError = formatError(e);
    yield put(
      auth.loginError({
        error: formattedError,
        errorText: formattedError,
      }),
    );
  }
}

// Fetch partner list
function* fetchPartnerList() {
  try {
    const response = yield call(globalApi.getPartnerList);
    yield put(actions.getPartnerListSuccess(response.data));
  } catch (e) {
    const formattedError = formatError(e);
    yield put(
      auth.loginError({
        error: formattedError,
        errorText: formattedError,
      }),
    );
  }
}

// Watchers

function* watchLocationListRequest() {
  yield takeLatest(types.GET_LOCATION_LIST_REQUEST, fetchLocationList);
}

function* watchPartnerListRequest() {
  yield takeLatest(types.GET_PARTNER_LIST_REQUEST, fetchPartnerList);
}

// Fetch screen data
function* fetchScreens(payload) {
  try {
    yield put(actions.setLoading(true));

    const response = yield call(
      globalApi.getScreenData,
      payload.userName,
      payload.url,
    );

    if (response.status === 204) {
      yield call(setSession, null);
      yield put(auth.logoutRequest(payload.username));

      yield put(
        actions.getScreenError({
          error: ['Unexpected error occurred', 'Unable to fetch screen data'],
        }),
      );
    } else {
      yield put(actions.getButtonScreenSuccess(response.data));
    }
  } catch (e) {
    yield call(setSession, null);
    yield put(auth.logoutRequest(payload.username));
    const formattedError = formatError(e);
    yield put(
      actions.getScreenError({
        error: formattedError,
        errorText: formattedError,
      }),
    );
  } finally {
    yield put(actions.setLoading(false));
  }
}

function* watchScreenRequest() {
  yield takeLatest(types.GET_SCREEN_REQUEST_DATA, fetchScreens);
}

const globalSagas = [
  fork(watchUserStateRequest),
  fork(watchScreenRequest),
  fork(watchLocationListRequest),
  fork(watchPartnerListRequest),
  fork(watchUserSetDispRequest),
  fork(watchUserBarCodeRequest),
];

export default globalSagas;
