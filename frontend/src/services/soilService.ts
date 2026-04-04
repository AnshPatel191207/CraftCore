import api from '../lib/axios';

export const soilService = {
  getReports: (page = 1, limit = 10) =>
    api.get('/soil-reports', { params: { page, limit } }),

  getLatest: () =>
    api.get('/soil-reports/latest'),

  getById: (id: string) =>
    api.get(`/soil-reports/${id}`),

  uploadReport: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/soil-reports', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  getAnalysis: (id: string) =>
    api.get(`/soil-reports/${id}/analysis`),

  deleteReport: (id: string) =>
    api.delete(`/soil-reports/${id}`)
};
