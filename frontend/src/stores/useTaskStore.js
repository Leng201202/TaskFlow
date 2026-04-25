import { create } from 'zustand';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const useTaskStore = create(
  (set, get) => ({
    tasks: [],
    isLoading: false,
    error: null,

    fetchTasks: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch(`${API_URL}/task`);
        if (!response.ok) throw new Error('Failed to fetch tasks');
        const data = await response.json();
        set({ tasks: data, isLoading: false });
      } catch (err) {
        set({ error: err.message, isLoading: false });
      }
    },

    addTask: async (task) => {
      set({ isLoading: true, error: null });
      try {
        const payload = {
          ...task,
          createdById: task.createdById || 'user-id-placeholder', // Replace when auth is ready
          completed: false,
        };
        const response = await fetch(`${API_URL}/task`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('Failed to create task');
        const newTask = await response.json();
        set((state) => ({ tasks: [...state.tasks, newTask], isLoading: false }));
      } catch (err) {
        set({ error: err.message, isLoading: false });
      }
    },

    updateTask: async (id, data) => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch(`${API_URL}/task`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, ...data }),
        });
        if (!response.ok) throw new Error('Failed to update task');
        const updatedTask = await response.json();
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === id ? updatedTask : task)),
          isLoading: false,
        }));
      } catch (err) {
        set({ error: err.message, isLoading: false });
      }
    },

    deleteTask: async (id) => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch(`${API_URL}/task`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
        if (!response.ok) throw new Error('Failed to delete task');
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
          isLoading: false,
        }));
      } catch (err) {
        set({ error: err.message, isLoading: false });
      }
    },

    toggleCompleted: async (id) => {
      const task = get().tasks.find((t) => t.id === id);
      if (task) {
        await get().updateTask(id, { completed: !task.completed });
      }
    },

    // Derived getters
    getActiveTasks: () => {
      const { tasks } = get();
      const now = new Date();
      return tasks.filter(
        (t) => !t.completed && new Date(t.dueDate) >= now
      );
    },

    getCompletedTasks: () => {
      const { tasks } = get();
      return tasks.filter((t) => t.completed);
    },

    getMissingTasks: () => {
      const { tasks } = get();
      const now = new Date();
      return tasks.filter(
        (t) => !t.completed && new Date(t.dueDate) < now
      );
    },

    getStats: () => {
      const { tasks } = get();
      const now = new Date();
      return {
        total: tasks.length,
        active: tasks.filter((t) => !t.completed && new Date(t.dueDate) >= now).length,
        completed: tasks.filter((t) => t.completed).length,
        missing: tasks.filter((t) => !t.completed && new Date(t.dueDate) < now).length,
      };
    },
  })
);

export default useTaskStore;
