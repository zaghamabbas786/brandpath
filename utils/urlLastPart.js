export const urlLastPart = currentUrl => {
  const parts = currentUrl ? currentUrl.split('/') : [];
  return parts.length > 0 ? parts[parts.length - 1] : 'MAINMENU';
};
