import {createStore, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducers from './reducers';
import rootSaga from './sagas';
import {setApiLoggingCallback} from './services/apiService';
import {setErpApiLoggingCallback} from './services/erpApiService';
import {logApiCall, logError} from './actions/logging';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(reducers, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

// Unified API success logging handler
const handleApiSuccess = logData => {
  store.dispatch(
    logApiCall(logData.method, logData.url, logData.status, {
      url: logData.url,
      statusCode: logData.status,  // HTTP status code (200, 201, etc)
      response: logData.responseData,  // Response body
      duration: logData.duration,
    }),
  );
};

// Unified error logging handler for both API and ERP API
const handleApiError = logData => {
  store.dispatch(
    logError(
      `API Error: ${logData.method} ${logData.url}`,
      logData.error,
      {
        eventType: 'api_error',
        url: logData.url,
        statusCode: logData.status,  // HTTP status code
        response: logData.errorDetails,  // Error response body
        errorMessage: logData.errorMessage,
        errorDetails: logData.errorDetails,
      },
    ),
  );
};

// Set up API logging callback after store is created
setApiLoggingCallback(logData => {
  if (logData.type === 'success') {
    handleApiSuccess(logData);
  } else if (logData.type === 'error') {
    handleApiError(logData);
  }
});

// Set up ERP API logging callback
setErpApiLoggingCallback(logData => {
  if (logData.type === 'success') {
    handleApiSuccess(logData);
  } else if (logData.type === 'error') {
    handleApiError(logData);
  }
});

export default store;
