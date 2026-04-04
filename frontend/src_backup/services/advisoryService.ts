import api from '../lib/axios';

export const advisoryService = {
  getAdvisories: (filters?: {
    category?: string; severity?: string; isRead?: boolean;
  }) => api.get('/advisories', { params: filters }),

  getById: (id: string) =>
    api.get(`/advisories/${id}`),

  markRead: (id: string) =>
    api.patch(`/advisories/${id}/read`),

  subscribe: (categories: string[]) =>
    api.post('/advisories/subscribe', { categories })
};
