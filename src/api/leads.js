import apiClient from "./apiClient";

export const LeadAPI = {
  list: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      // Backend uses '-createdAt' for sorting by default if not specified
      // params.append('sort', sort);
      // params.append('limit', limit);
      const response = await apiClient.get(`/leads?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      console.error(
        "Error fetching leads:",
        error.response?.data || error.message
      );
      throw (
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch leads."
      );
    }
  },

  get: async (id) => {
    try {
      const response = await apiClient.get(`/leads/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(
        `Error fetching lead ${id}:`,
        error.response?.data || error.message
      );
      throw (
        error.response?.data?.message ||
        error.message ||
        `Failed to fetch lead ${id}.`
      );
    }
  },

  create: async (data) => {
    try {
      const response = await apiClient.post("/leads", data);
      return response.data.data;
    } catch (error) {
      console.error(
        "Error creating lead:",
        error.response?.data || error.message
      );
      throw (
        error.response?.data?.message ||
        error.message ||
        "Failed to create lead."
      );
    }
  },

  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/leads/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error(
        `Error updating lead ${id}:`,
        error.response?.data || error.message
      );
      throw (
        error.response?.data?.message ||
        error.message ||
        `Failed to update lead ${id}.`
      );
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/leads/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error deleting lead ${id}:`,
        error.response?.data || error.message
      );
      throw (
        error.response?.data?.message ||
        error.message ||
        `Failed to delete lead ${id}.`
      );
    }
  },
};
