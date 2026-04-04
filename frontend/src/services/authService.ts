import api from '../lib/axios';

export const authService = {
  register: (data: {
    name: string; email: string; password: string;
    farmName?: string; totalAcres?: number;
  }) => api.post('/auth/register', data),

  login: async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('accessToken', res.data.data.accessToken);
    return res.data.data;     // { user, accessToken }
  },

  logout: async () => {
    await api.post('/auth/logout').catch(() => {});
    localStorage.removeItem('accessToken');
  },

  getMe: () => api.get('/auth/me'),

  updateProfile: (data: {
    name?: string; farmName?: string;
    totalAcres?: number; location?: object;
  }) => api.put('/auth/profile', data),

  googleLogin: () => {
    window.location.href = '/api/auth/google';
  }
};
