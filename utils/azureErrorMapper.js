// utils/azureErrorMapper.js

export function getAzureFriendlyError(errorMessage) {
  if (!errorMessage)
    return ['Azure login failed', 'An unknown error occurred.'];

  const msg = errorMessage.toLowerCase();

  if (msg.includes('aadsts90135')) {
    return ['Login Cancelled', 'You cancelled the login. Please try again.'];
  }

  if (msg.includes('aadsts700016')) {
    return [
      'Invalid App Registration',
      'The application is not registered correctly in Azure. Contact IT.',
    ];
  }

  if (msg.includes('aadsts50011')) {
    return [
      'Redirect URI Mismatch',
      'Login failed due to incorrect redirect URI. Contact IT.',
    ];
  }

  if (msg.includes('aadsts50034')) {
    return [
      'User Not Found',
      'The entered account doesn’t exist in the directory.',
    ];
  }

  if (msg.includes('aadsts50076')) {
    return ['MFA Required', 'Please complete multi-factor authentication.'];
  }

  if (msg.includes('aadsts50158')) {
    return ['Session Error', 'A session issue occurred. Try again.'];
  }

  if (msg.includes('network')) {
    return [
      'Network Error',
      'Please check your internet connection and try again.',
    ];
  }

  if (msg.includes('timeout')) {
    return ['Login Timeout', 'Login took too long. Please try again.'];
  }

  // Fallback for unknown AADSTS codes
  if (msg.includes('aadsts')) {
    return [
      'Azure Login Error',
      'An authentication issue occurred. Contact IT if this continues.',
    ];
  }

  return ['Azure login failed', errorMessage];
}
