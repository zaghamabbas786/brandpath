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
      username,
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
export const scanBarcode = (userName, page, barcode) =>
  axios.post('/mobile/Scan', {
    userName,
    page,
    barcode,
  });
