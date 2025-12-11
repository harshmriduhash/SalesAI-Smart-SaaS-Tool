import apiClient from './apiClient';

export const ActivityAPI = {
  list: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      // Backend uses '-createdAt' for sorting by default if not specified
      // params.append('sort', sort); 
      // params.append('limit', limit); 
      const response = await apiClient.get(`/activities?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching activities:', error.response?.data || error.message);
      throw error.response?.data?.message || error.message || 'Failed to fetch activities.';
    }
  },

  create: async (data) => {
    try {
      const response = await apiClient.post('/activities', data);
      return response.data.data;
    } catch (error) {
      console.error('Error creating activity:', error.response?.data || error.message);
      throw error.response?.data?.message || error.message || 'Failed to create activity.';
    }
  },

  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/activities/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating activity ${id}:`, error.response?.data || error.message);
      throw error.response?.data?.message || error.message || `Failed to update activity ${id}.`;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/activities/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting activity ${id}:`, error.response?.data || error.message);
      throw error.response?.data?.message || error.message || `Failed to delete activity ${id}.`;
    }
  },
};