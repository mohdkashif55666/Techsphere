import { create } from 'zustand';
import { api } from '../lib/api';

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: true,
  error: null,

  fetchMe: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await api.get('/auth/me');
      set({ user: res.data?.user || null, isLoading: false });
    } catch {
      set({ user: null, isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      set({ user: res.data?.user, isLoading: false });
      return res.data?.user;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/register', { name, email, password });
      set({ user: res.data?.user, isLoading: false });
      return res.data?.user;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      set({ user: null, error: null });
    }
  },

  toggleFavorite: async (toolId) => {
    try {
      const res = await api.post(`/favorites/${toolId}`);
      set((state) => {
        if (!state.user) return state;
        return {
          user: {
            ...state.user,
            savedTools: res.data?.savedTools || [],
          },
        };
      });
      return res.data?.isSaved;
    } catch (err) {
      console.error('Failed to toggle favorite', err);
      throw err;
    }
  },
}));
