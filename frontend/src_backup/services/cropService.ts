import api from '../lib/axios';

export const cropService = {
  getCrops: () => api.get('/crops'),

  createCrop: (data: {
    name: string; area: number; stage: string;
    plantedDate: string; expectedHarvest: string; health?: number;
  }) => api.post('/crops', data),

  updateCrop: (id: string, data: object) =>
    api.put(`/crops/${id}`, data),

  deleteCrop: (id: string) =>
    api.delete(`/crops/${id}`),

  getHealthHistory: (id: string) =>
    api.get(`/crops/${id}/health-history`),

  updateHealth: (id: string, health: number, notes?: string) =>
    api.post(`/crops/${id}/health`, { health, notes })
};
