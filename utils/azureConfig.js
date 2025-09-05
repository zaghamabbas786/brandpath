import Config from 'react-native-config';

export const azureConfig = {
  clientId: Config.REACT_APP_CLIENTID,
  redirectUrl: Config.REACT_APP_REDIRECT_URL,
  authorizationUserAgent: 'DEFAULT',
  scopes: ['openid', 'profile', 'email'],
  additionalParameters: {prompt: 'select_account'},
  serviceConfiguration: {
    authorizationEndpoint: `https://login.microsoftonline.com/${Config.REACT_APP_TANENT_ID}/oauth2/v2.0/authorize`,
    tokenEndpoint: `https://login.microsoftonline.com/${Config.REACT_APP_TANENT_ID}/oauth2/v2.0/token`,
    revocationEndpoint: `https://login.microsoftonline.com/${Config.REACT_APP_TANENT_ID}/oauth2/v2.0/logout`,
  },
};
