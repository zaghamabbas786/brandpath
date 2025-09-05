// Helper function to format the date
export const formatDate = dateString => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // Returns "yyyy-mm-dd"
};
