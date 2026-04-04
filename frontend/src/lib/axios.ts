import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Anti-infinite loop retry flag
let isRefreshing = false;
let refreshQueue: any[] = [];

// Response interceptor
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    
    // Auto-refresh logic on 401
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      
      // If code is specifically 'TOKEN_EXPIRED', try to refresh
      if (error.response?.data?.code === 'TOKEN_EXPIRED') {
        if (isRefreshing) {
          // If already refreshing, wait for it to complete
          return new Promise((resolve) => {
            refreshQueue.push((token: string) => {
              original.headers.Authorization = `Bearer ${token}`;
              resolve(api(original));
            });
          });
        }
        
        isRefreshing = true;
        try {
          const res = await axios.post('/api/v1/auth/refresh', {}, { withCredentials: true });
          const newToken = res.data.data.accessToken;
          localStorage.setItem('accessToken', newToken);
          original.headers.Authorization = `Bearer ${newToken}`;
          
          // Process queue
          refreshQueue.forEach((cb) => cb(newToken));
          refreshQueue = [];
          
          return api(original);
        } catch (refreshErr) {
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
        } finally {
          isRefreshing = false;
        }
      } else {
        // Other 401 errors (e.g. invalid user) just logout
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);


export const getApiError = (error: any): string =>
  error?.response?.data?.message ||
  error?.message ||
  'Something went wrong';

export default api;

