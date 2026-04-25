import { create } from 'zustand';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const useUserStore = create(
  (set) => ({
    user: {
      id: 'user-id-placeholder',
      name: 'John Doe',
      email: 'john.doe@example.com',
      bio: 'Full-stack developer passionate about building great products.',
    },
    isLoading: false,
    error: null,

    fetchUser: async (id) => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch(`${API_URL}/user/get`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        if (!response.ok) throw new Error('Failed to fetch user');
        const data = await response.json();
        set({ user: data, isLoading: false });
      } catch (err) {
        set({ error: err.message, isLoading: false });
      }
    },

    updateUser: async (id, data) => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch(`${API_URL}/user`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, ...data }),
        });
        if (!response.ok) throw new Error('Failed to update user');
        const updatedUser = await response.json();
        set({ user: updatedUser, isLoading: false });
      } catch (err) {
        set({ error: err.message, isLoading: false });
      }
    },
  })
);

export default useUserStore;
