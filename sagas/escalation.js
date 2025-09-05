import {call, put, fork, takeLatest} from 'redux-saga/effects';
import * as types from '../actions';
import * as globalActions from '../actions/global';
import * as actions from '../actions/escalation';
import * as escalation from '../api/escalation';
import {formatError} from '../utils/errorHandler';

// Escalation print
function* escalationPrint(payload) {
  const {
    InvoiceNum,
    OrderRef,
    User,
    ForceNewLabel,
    StationID,
    Courier,
    CustomsDocType,
    Staging,
    AdminMode,
  } = payload.data;

  try {
    // Utility function to process errors
    const processError = function* (error) {
      yield put(
        globalActions.barCodeError({
          error,
        }),
      );
    };

    yield put(globalActions.setLoading(true));

    const response = yield call(
      escalation.printing,
      InvoiceNum,
      OrderRef,
      User,
      ForceNewLabel,
      StationID,
      Courier,
      CustomsDocType,
      Staging,
      AdminMode,
    );

    if (!response.data || typeof response.data !== 'object') {
      yield processError([
        'Unexpected error occurred',
        'Response format is invalid or empty.',
      ]);
    } else if (response.data.error) {
      yield processError([response.data.error]);
    }

    // Determine message based on ForceNewLabel
    const message = ForceNewLabel
      ? `New label has been printed and sent to ${StationID}`
      : `Label has been reprinted and sent to ${StationID}`;

    // Dispatch success action with message
    yield put(actions.getEscalationPrintSuccess(message));
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

function* watchEscalationPrint() {
  yield takeLatest(types.GET_ESCALATION_PRINT_REQUEST, escalationPrint);
}

const escalationSagas = [fork(watchEscalationPrint)];

export default escalationSagas;
