import api from '../lib/axios';

export const authService = {
  /**
   * KrishiSetu Auth Service
   * All methods use the 'api' instance from axios.ts prefixed with /api
   */

  register: (data: {
    name: string; email: string; password: string;
    farmName?: string; totalAcres?: number;
  }) => api.post('/auth/register', data),

  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),

  logout: () => 
    api.post('/auth/logout').catch(() => {}),

  getMe: () => 
    api.get('/auth/me'),

  updateProfile: (data: {
    name?: string; farmName?: string;
    totalAcres?: number; location?: object;
  }) => api.put('/auth/profile', data),

  googleLogin: () => {
    // Standardizing to /api/auth/google as per the new prefix policy
    window.location.href = `${api.defaults.baseURL}/auth/google`;
  }
};
