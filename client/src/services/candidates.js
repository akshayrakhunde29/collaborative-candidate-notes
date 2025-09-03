import api from './api';

export const candidateService = {
  getCandidates: async () => {
    const response = await api.get('/candidates');
    return response.data;
  },

  getCandidate: async (id) => {
    const response = await api.get(`/candidates/${id}`);
    return response.data;
  },

  createCandidate: async (name, email) => {
    const response = await api.post('/candidates', { name, email });
    return response.data;
  },

  updateCandidate: async (id, name, email) => {
    const response = await api.put(`/candidates/${id}`, { name, email });
    return response.data;
  },

  deleteCandidate: async (id) => {
    const response = await api.delete(`/candidates/${id}`);
    return response.data;
  }
};