import axios from '../services/apiService';

// Function to get user state
export const getScreenData = async (userName, url) => {
  return await axios.get(`${url}`, {
    params: {
      userName: userName,
    },
  });
};

// Function to get user state
export const getUserState = username =>
  axios.get('/mobile/GetUserState', {
    params: {
      UserName: username,  // Backend might expect UserName (capital U)
    },
  });

// Function to fetch location list
export const getLocationList = () => axios.get('/mobile/LocationList');

// Function to fetch partner list
export const getPartnerList = () => axios.get('/mobile/PartnerList');

// Function to set location and partner values
export const setDispEnv = (userName, stationID, partnerKey) =>
  axios.post('/mobile/SetDispEnv', {
    userName,
    stationID,
    partnerKey,
  });

// Function to set location and partner values
export const scanBarcode = (userName, page, barcode) => {
  console.log('🚀 API - scanBarcode called with parameters:', {
    userName,
    page,
    barcode,
  });
  console.log('🎯 API - page parameter value:', page);
  
  return axios.post('/mobile/Scan', {
    userName,
    page,
    barcode,
  });
};

// Function to get shipping list - FIXED: Added userName parameter
export const getShippingList = (userName) =>
  axios.get('/mobile/GetShippingList', {
    params: {
      UserName: userName, // Match the backend parameter name
    },
  });

// Function to set shipping type
export const setShippingType = (userName, courierName) =>
  axios.post('/mobile/SetShippingType', {
    userName,
    courierName,
  });

// Function to get dispatch list
export const getDispatchList = userName =>
  axios.get('/mobile/GetDispatchList', {
    params: {
      UserName: userName,
    },
  });

// Function to get order detail
export const getOrderDetail = (userName, orderRef) =>
  axios.get('/mobile/GetOrderDetail', {
    params: {
      UserName: userName,
      OrderRef: orderRef,
    },
  });

// Function to send logs to backend
export const sendLogs = logs =>
  axios.post('/mobile/Logging', logs[0]);
