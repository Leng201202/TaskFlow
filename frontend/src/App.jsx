import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/Layout/AppLayout';
import HomePage from './pages/HomePage';
import CreateTaskPage from './pages/CreateTaskPage';
import TaskHistoryPage from './pages/TaskHistoryPage';
import ProfilePage from './pages/ProfilePage';
import useTaskStore from './stores/useTaskStore';
import useUserStore from './stores/useUserStore';

function App() {
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const fetchUser = useUserStore((state) => state.fetchUser);

  useEffect(() => {
    fetchTasks();
    // Assuming hardcoded user for now, adjust when auth is ready
    fetchUser('user-id-placeholder');
  }, [fetchTasks, fetchUser]);

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateTaskPage />} />
        <Route path="/history" element={<TaskHistoryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
