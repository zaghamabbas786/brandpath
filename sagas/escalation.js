import {call, put, fork, takeLatest} from 'redux-saga/effects';
import * as types from '../actions';
import * as globalActions from '../actions/global';
import * as actions from '../actions/escalation';
import * as loggingActions from '../actions/logging';
import * as escalation from '../api/escalation';
import {formatError} from '../utils/errorHandler';

// Escalation print
function* escalationPrint(payload) {
  console.log('🎬 escalationPrint saga called with payload:', JSON.stringify(payload, null, 2));
  console.log('📋 payload.data:', JSON.stringify(payload.data, null, 2));
  
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
  
  console.log('🔎 Extracted values from payload.data:', {
    InvoiceNum,
    OrderRef,
    User,
    ForceNewLabel,
    StationID,
    Courier,
    CustomsDocType,
    Staging,
    AdminMode,
  });

  // Create request payload for logging
  const requestPayload = {
    InvoiceNum,
    OrderRef,
    User,
    ForceNewLabel,
    StationID,
    Courier,
    CustomsDocType,
    Staging,
    AdminMode,
  };

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

    // Log API request
    yield put(
      loggingActions.logApiCall('POST', '/PrintLabel', 'pending', {
        eventType: 'api_call',
        screenName: 'DispatchDetailScreen',
        request: requestPayload,
        orderRef: OrderRef,
        labelType: ForceNewLabel ? 'NEW_LABEL' : 'REPRINT_LABEL',
      }),
    );

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

    console.log('🖨️ Label Printing API Response:', JSON.stringify(response, null, 2));
    console.log('📊 Label Printing API Status Code:', response.status);

    if (!response.data || typeof response.data !== 'object') {
      const errorMsg = [
        'Unexpected error occurred',
        'Response format is invalid or empty.',
      ];
      
      // Log API error
      yield put(
        loggingActions.logError('Print Label API - Invalid Response', null, {
          eventType: 'api_call',
          screenName: 'DispatchDetailScreen',
          url: '/PrintLabel',
          request: requestPayload,
          response: response.data,
          statusCode: response.status || 0,
          errorMessage: errorMsg.join(', '),
        }),
      );
      
      yield processError(errorMsg);
    } else if (response.data.error) {
      // Log API error from response
      yield put(
        loggingActions.logError('Print Label API - Response Error', null, {
          eventType: 'api_call',
          screenName: 'DispatchDetailScreen',
          url: '/PrintLabel',
          request: requestPayload,
          response: response.data,
          statusCode: response.status || 200,
          errorMessage: response.data.error,
        }),
      );
      
      yield processError([response.data.error]);
    } else {
      // Log successful API response
      yield put(
        loggingActions.logApiCall('POST', '/PrintLabel', 200, {
          eventType: 'api_call',
          screenName: 'DispatchDetailScreen',
          request: requestPayload,
          response: response.data,
          statusCode: response.status || 200,
          orderRef: OrderRef,
          labelType: ForceNewLabel ? 'NEW_LABEL' : 'REPRINT_LABEL',
        }),
      );
    }

    // Determine message based on ForceNewLabel
    const message = ForceNewLabel
      ? `New label has been printed and sent to ${StationID}`
      : `Label has been reprinted and sent to ${StationID}`;

    // Dispatch success action with message
    yield put(actions.getEscalationPrintSuccess(message));
  } catch (e) {
    const formattedError = formatError(e);
    
    // Log API exception
    yield put(
      loggingActions.logError('Print Label API - Exception', e, {
        eventType: 'api_call',
        screenName: 'DispatchDetailScreen',
        url: '/PrintLabel',
        request: requestPayload,
        statusCode: e.response?.status || 0,
        errorMessage: formattedError,
        errorDetails: e.message,
      }),
    );
    
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
  console.log('👀 watchEscalationPrint saga initialized - waiting for GET_ESCALATION_PRINT_REQUEST');
  yield takeLatest(types.GET_ESCALATION_PRINT_REQUEST, escalationPrint);
}

const escalationSagas = [fork(watchEscalationPrint)];

export default escalationSagas;
