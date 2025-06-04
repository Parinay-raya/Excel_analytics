/**
 * Debug helper to identify issues with the application
 */

// Log initialization message
console.log('Application initializing...');

// Check if required DOM elements exist
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded');
  
  // Check if root element exists
  const rootElement = document.getElementById('root');
  if (rootElement) {
    console.log('Root element found');
  } else {
    console.error('Root element not found! Application cannot render.');
  }
  
  // Check for localStorage access
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    console.log('localStorage is accessible');
  } catch (error) {
    console.error('localStorage is not accessible:', error);
  }
});

// Export a function to check route access
export const checkRouteAccess = (route) => {
  console.log(`Attempting to access route: ${route}`);
};

export default {
  checkRouteAccess
};