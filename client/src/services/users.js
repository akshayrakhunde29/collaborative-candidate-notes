import api from './api';

export const userService = {
  searchUsers: async (query) => {
    const response = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  }
};
