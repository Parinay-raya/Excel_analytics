// src/config/api.js

const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api', // ensure port matches backend
  ENDPOINTS: {
    LOGIN: '/users/login',
    REGISTER: '/users/register',
    PROFILE: '/users/profile',
  },
  getUrl(endpoint) {
    return this.BASE_URL + endpoint;
  }
};

export default API_CONFIG;
