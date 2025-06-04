/**
 * API Configuration
 * 
 * This file contains the configuration for API endpoints and base URL.
 * For Vite, environment variables must be prefixed with VITE_
 */

const API_CONFIG = {
  // Use Vite's environment variables (fallback to default if not available)
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  
  ENDPOINTS: {
    LOGIN: '/users/login',
    REGISTER: '/users/register',
    PROFILE: '/users/profile',
    // Add other endpoints as needed
  },

  getUrl(endpoint) {
    return this.BASE_URL + endpoint;
  }
};

export default API_CONFIG;
