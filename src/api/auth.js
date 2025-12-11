import apiClient from './apiClient';

export const AuthAPI = {
  login: async ({ email, password }) => {
    try {
      const response = await apiClient.post('/users/login', { email, password });
      if (response.data && response.data.token && response.data.user) {
        localStorage.setItem('user_token', response.data.token); // Consistent localStorage key
        localStorage.setItem('user_data', JSON.stringify(response.data.user)); // Consistent localStorage key
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error.response?.data?.message || error.message || 'Failed to log in.';
    }
  },

  register: async ({ name, email, password }) => {
    try {
      // Backend expects 'name' for registration
      const response = await apiClient.post('/users/register', { name, email, password }); 
      if (response.data && response.data.token && response.data.user) {
        localStorage.setItem('user_token', response.data.token); // Consistent localStorage key
        localStorage.setItem('user_data', JSON.stringify(response.data.user)); // Consistent localStorage key
      }
      return response.data;
    } catch (error) {
      console.error('Register error:', error.response?.data || error.message);
      throw error.response?.data?.message || error.message || 'Failed to register.';
    }
  },

  logout: () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_data');
    // window.location.href = '/login'; // Redirect handled by interceptor or App.jsx
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('user_token') && !!localStorage.getItem('user_data');
  },

  getCurrentUser: () => {
    try {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (e) {
      console.error("Failed to parse user data from localStorage", e);
      return null;
    }
  },
};