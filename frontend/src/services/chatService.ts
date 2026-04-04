import api from '../lib/axios';

export const chatService = {
  getSessions: () => api.get('/chat/sessions'),

  createSession: () => api.post('/chat/sessions'),

  getMessages: (sessionId: string) =>
    api.get(`/chat/sessions/${sessionId}/messages`),

  sendMessage: (sessionId: string, content: string, domain: string) =>
    api.post(`/chat/sessions/${sessionId}/messages`, { content, domain }),

  deleteSession: (sessionId: string) =>
    api.delete(`/chat/sessions/${sessionId}`),

  quickAdvice: (query: string, domain: string) =>
    api.post('/chat/quick-advice', { query, domain })
};
