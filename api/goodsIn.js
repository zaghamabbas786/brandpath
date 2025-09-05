// utils
import axios from '../services/apiService';

export const getDockToStock = (username, search) =>
  axios.get('/mobile/GetDockData', {
    params: {
      username,
      ...(search ? {search} : {}),
    },
  });

export const setDocDataLog = (UserName, PoNum, PoDate, TrackingNumber) =>
  axios.post('/mobile/SetDocDataLog', {
    UserName,
    PoNum,
    PoDate,
    TrackingNumber,
  });
