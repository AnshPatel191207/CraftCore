import api from '../lib/axios';

export const dashboardService = {
  getStats: () =>
    api.get('/dashboard/stats'),

  getYieldProjection: (months = 6) =>
    api.get('/dashboard/yield-projection', { params: { months } }),

  getRainfall: (months = 6) =>
    api.get('/dashboard/rainfall', { params: { months } }),

  getActivityFeed: () =>
    api.get('/dashboard/activity-feed'),

  getNutrients: () =>
    api.get('/dashboard/nutrients')
};
