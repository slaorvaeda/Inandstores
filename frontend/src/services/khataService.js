import axios from 'axios';

const API_BASE_URL = '/api/khata';

export const khataService = {
  // Get all khatas
  getAllKhatas: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await axios.get(`${API_BASE_URL}?${queryParams}`);
    return response.data;
  },

  // Get khata summary
  getSummary: async () => {
    const response = await axios.get(`${API_BASE_URL}/summary`);
    return response.data;
  },

  // Get specific khata
  getKhata: async (khataId) => {
    const response = await axios.get(`${API_BASE_URL}/${khataId}`);
    return response.data;
  },

  // Create new khata
  createKhata: async (khataData) => {
    const response = await axios.post(API_BASE_URL, khataData);
    return response.data;
  },

  // Update khata
  updateKhata: async (khataId, khataData) => {
    const response = await axios.put(`${API_BASE_URL}/${khataId}`, khataData);
    return response.data;
  },

  // Close khata
  closeKhata: async (khataId) => {
    const response = await axios.delete(`${API_BASE_URL}/${khataId}`);
    return response.data;
  },

  // Get entries for a khata
  getEntries: async (khataId, params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await axios.get(`${API_BASE_URL}/${khataId}/entries?${queryParams}`);
    return response.data;
  },

  // Add entry to khata
  addEntry: async (khataId, entryData) => {
    const response = await axios.post(`${API_BASE_URL}/${khataId}/entries`, entryData);
    return response.data;
  }
};
