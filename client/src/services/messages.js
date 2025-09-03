import api from './api';

export const messageService = {
  getMessages: async (candidateId, page = 1, limit = 50) => {
    const response = await api.get(`/messages/${candidateId}?page=${page}&limit=${limit}`);
    return response.data;
  },

  createMessage: async (candidateId, content, taggedUsers = []) => {
    const response = await api.post('/messages', {
      candidateId,
      content,
      taggedUsers
    });
    return response.data;
  }
};