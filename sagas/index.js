import {all} from 'redux-saga/effects';
import authSagas from './auth';
import globalSagas from './global';
import goodsInSaga from './goodsIn';
import inventorySaga from './inventory';
import escalationSagas from './escalation';

export default function* rootSaga() {
  yield all([...authSagas]);
  yield all([...globalSagas]);
  yield all([...goodsInSaga]);
  yield all([...inventorySaga]);
  yield all([...escalationSagas]);
}
