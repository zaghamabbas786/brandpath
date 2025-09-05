import axios from '../services/apiService';

export const getSecurityCheck = (username, TrackingNum) =>
  axios.get('/mobile/GetTrackingData', {
    params: {
      username,
      TrackingNum,
    },
  });

export const startStockMove = userName =>
  axios.post('/mobile/StartStockMove', {
    userName,
  });

export const setMasterLoc = userName =>
  axios.post('/mobile/SetMasterLoc', {
    userName,
  });
export const getMasterLoc = userName =>
  axios.get('/mobile/GetMasterLoc', {
    params: {
      userName,
    },
  });

export const setStockMoveQty = (userName, qty) =>
  axios.post('/mobile/SetStockMoveQty', {
    userName,
    qty,
  });

export const getStockMoveDetail = userName =>
  axios.get('/mobile/GetStockMoveDetail', {
    params: {
      userName,
    },
  });

export const cancelStockMove = userName =>
  axios.post('/mobile/CancelStockMove', {
    userName,
  });
