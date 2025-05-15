import axios from 'axios';
import store from '../store';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to inject the auth token
api.interceptors.request.use(
  (config) => {
    const token = store.getters['auth/token'];
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors and auth issues
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    // Handle authentication errors
    if (response && response.status === 401) {
      // Clear auth state if the token is invalid or expired
      store.dispatch('auth/logout');
    }
    
    // Show error in console for debugging
    console.error('API Error:', error);
    
    return Promise.reject(error);
  }
);

export default api;
