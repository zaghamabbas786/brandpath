import axios from '../services/erpApiService';

export const printing = (
  InvoiceNum,
  OrderRef,
  User,
  ForceNewLabel,
  StationID,
  Courier,
  CustomsDocType,
  Staging,
  AdminMode,
) =>
  axios.post('/PrintLabel', {
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
