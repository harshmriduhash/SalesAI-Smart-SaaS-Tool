// export default apiClient;
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api'; // Your backend API base URL

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for sending cookies/auth headers if needed
});

// Add a request interceptor to include the auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('user_token'); // Consistent localStorage key
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration or 401/403 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.error("Unauthorized access or token expired. Clearing session.");
      localStorage.removeItem('user_token'); // Clear invalid data
      localStorage.removeItem('user_data');
      // Redirect to login page if not already there
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
         window.location.href = '/login'; 
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;