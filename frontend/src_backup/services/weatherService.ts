import api from '../lib/axios';

// coords are optional — backend falls back to user.location
export const weatherService = {
  getCurrent: (lat?: number, lng?: number) =>
    api.get('/weather/current', { params: { lat, lng } }),

  getForecast: (days = 7, lat?: number, lng?: number) =>
    api.get('/weather/forecast', { params: { days, lat, lng } }),

  getAgricultural: (lat?: number, lng?: number) =>
    api.get('/weather/agricultural', { params: { lat, lng } }),

  getSavedLocations: () =>
    api.get('/weather/locations'),

  saveLocation: (name: string, lat: number, lng: number) =>
    api.post('/weather/locations', { name, lat, lng })
};
