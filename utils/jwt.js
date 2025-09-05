import {jwtDecode} from 'jwt-decode';

export const decodeJwt = token => {
  const decodedToken = jwtDecode(token);

  const uniqueName = decodedToken.unique_name;
  const username = uniqueName.split('@')[0]; // Extract part before "@"

  return username;
};
