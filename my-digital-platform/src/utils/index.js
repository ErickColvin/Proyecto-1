// Utility functions

// Generate a unique ID for new employees
export const generateId = () => {
  return Math.random().toString(36).substring(2, 9);
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Format date to locale string
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Get role color class based on role
export const getRoleColorClass = (role) => {
  switch (role) {
    case 'admin':
      return 'text-purple-700 bg-purple-100';
    case 'manager':
      return 'text-blue-700 bg-blue-100';
    case 'developer':
      return 'text-green-700 bg-green-100';
    case 'designer':
      return 'text-orange-700 bg-orange-100';
    case 'support':
      return 'text-teal-700 bg-teal-100';
    default:
      return 'text-gray-700 bg-gray-100';
  }
};

// Get status color class based on status
export const getStatusColorClass = (status) => {
  return status === 'active' 
    ? 'text-green-700 bg-green-100' 
    : 'text-red-700 bg-red-100';
};