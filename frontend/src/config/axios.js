import axios from 'axios';

// Set the base URL for all axios requests
// In development, this should point to your backend server
const baseURL = 'http://localhost:4000';

// Create an axios instance with default config
const axiosInstance = axios.create({
  baseURL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add a request interceptor to include auth token if available
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage if it exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for global error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    // You can add global error handling here
    // For example, redirect to login page on 401 errors
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors
      console.log('Unauthorized access. Redirecting to login...');
      // You might want to redirect to login page or dispatch a logout action
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance; 