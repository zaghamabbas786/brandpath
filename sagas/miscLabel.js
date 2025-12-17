import {call, put, fork, takeLatest} from 'redux-saga/effects';
import * as types from '../actions';
import * as globalActions from '../actions/global';
import * as actions from '../actions/miscLabel';
import * as miscLabel from '../api/miscLabel';
import {formatError} from '../utils/errorHandler';

// Misc Label print
function* miscLabelPrint(payload) {
  console.log('🎬 miscLabelPrint saga called');
  const {OrderRef, InvoiceNum, User, ForceNewLabel, StationID, Courier, CustomsDocType, Staging, AdminMode} = payload.data;
  console.log('miscLabelPrint saga called with payload:', JSON.stringify(payload, null, 2));

  try {
    // Utility function to process errors
    const processError = function* (error) {
      console.log('❌ processError called with:', error);
      yield put(
        globalActions.barCodeError({
          error,
        }),
      );
    };

    // Clear any existing message first to ensure toast triggers
    yield put(globalActions.clearMessage());
    yield put(globalActions.setLoading(true));

    console.log('🔄 Calling PrintMiscLabel API...');
    const response = yield call(miscLabel.printMiscLabel, {
      OrderRef,
      InvoiceNum,
      User,
      ForceNewLabel,
      StationID,
      Courier,
      CustomsDocType,
      Staging,
      AdminMode,
    });

    console.log('✅ PrintMiscLabel API response:', JSON.stringify(response.data, null, 2));

    if (!response.data || typeof response.data !== 'object') {
      console.log('❌ Invalid response format');
      yield processError([
        'Unexpected error occurred',
        'Response format is invalid or empty.',
      ]);
    } else if (response.data.error) {
      console.log('❌ API returned error:', response.data.error);
      yield processError([response.data.error]);
    } else {
      console.log('✅ PrintMiscLabel success!');
      const message = `Label has been printed and sent to ${StationID}`;
      // Dispatch success action with message
      yield put(actions.getMiscLabelPrintSuccess(message));
    }
  } catch (e) {
    console.log('❌ PrintMiscLabel exception:', e.message);
    console.log('❌ Exception details:', {
      message: e.message,
      response: e.response?.data,
      status: e.response?.status,
    });
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

function* watchMiscLabelPrint() {
  yield takeLatest(types.GET_MISC_LABEL_PRINT_REQUEST, miscLabelPrint);
}

const miscLabelSagas = [fork(watchMiscLabelPrint)];

export default miscLabelSagas;

