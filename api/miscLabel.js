import axios from '../services/erpApiService';
import {getAuthHeader} from '../utils/apiConfig';
import Config from 'react-native-config';

export const printMiscLabel = async ({
  OrderRef,
  InvoiceNum,
  User,
  ForceNewLabel,
  StationID,
  Courier,
  CustomsDocType,
  Staging,
  AdminMode,
}) => {
  const payload = {
    OrderRef: OrderRef,
    StationID: StationID,
  };
  console.log('prntMiscLabel API - Sending payload:', JSON.stringify(payload, null, 2));
  return axios.post('/PrintMiscLabel', payload);
};
