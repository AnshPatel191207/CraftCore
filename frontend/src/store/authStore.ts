import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/authService';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'farmer' | 'admin';
  farmName?: string;
  totalAcres?: number;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  setAuth: (user: User, token: string) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true, error: null });
      },
      
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authService.login(email, password);
          const { user, accessToken } = res.data.data;
          
          localStorage.setItem('token', accessToken);
          set({ 
            user, 
            token: accessToken, 
            isAuthenticated: true, 
            isLoading: false,
            error: null
          });
        } catch (err: any) {
          const msg = err.response?.data?.message || 'Login failed';
          set({ error: msg, isLoading: false });
          throw err;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authService.register(data);
          const { user, accessToken } = res.data.data;
          
          localStorage.setItem('token', accessToken);
          set({ 
            user, 
            token: accessToken, 
            isAuthenticated: true, 
            isLoading: false,
            error: null
          });
        } catch (err: any) {
          const msg = err.response?.data?.message || 'Registration failed';
          set({ error: msg, isLoading: false });
          throw err;
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch (err) {
          console.error('Logout error:', err);
        } finally {
          localStorage.removeItem('token');
          set({ user: null, token: null, isAuthenticated: false, error: null });
        }
      },

      checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          set({ isAuthenticated: false, user: null, token: null });
          return;
        }

        try {
          const res = await authService.getMe();
          set({ 
            user: res.data.data.user, 
            token, 
            isAuthenticated: true 
          });
        } catch (err) {
          localStorage.removeItem('token');
          set({ isAuthenticated: false, user: null, token: null });
        }
      },

      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),
    }),
    {
      name: 'agrisense-auth',
      partialize: (state: AuthState) => ({ 
        token: state.token, 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
