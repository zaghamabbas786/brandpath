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
) => {
  console.log('🔍 printing API function called with parameters:', {
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

  // Build payload with lowercase property names (API requirement)
  const payload = {
    invoiceNum: String(InvoiceNum), // Ensure string type
    orderRef: OrderRef, // lowercase
    user: User, // lowercase
    forceNewLabel: ForceNewLabel, // lowercase
    stationID: StationID, // lowercase
    staging: Staging, // lowercase
    adminMode: AdminMode, // lowercase
  };

  // Only add optional fields if they have values
  if (Courier !== undefined && Courier !== null) {
    payload.courier = Courier; // lowercase
  }
  if (CustomsDocType !== undefined && CustomsDocType !== null) {
    payload.customsDocType = CustomsDocType; // lowercase
  }

  console.log(
    '📦 PrintLabel API - Sending payload:',
    JSON.stringify(payload, null, 2),
  );

  return axios.post('/PrintLabel', payload);
};
