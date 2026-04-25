import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlusCircle } from 'react-icons/fi';
import useTaskStore from '../stores/useTaskStore';
import TaskForm from '../components/Tasks/TaskForm';
import './CreateTaskPage.css';

export default function CreateTaskPage() {
  const addTask = useTaskStore((state) => state.addTask);
  const navigate = useNavigate();

  const handleSubmit = (formData) => {
    addTask(formData);
    // Navigate to home after short delay so user sees success message
    setTimeout(() => navigate('/'), 1500);
  };

  return (
    <div className="create-task-page">
      <section className="page-header animate-fade-in">
        <div className="page-header-icon">
          <FiPlusCircle />
        </div>
        <div>
          <h1>Create New Task</h1>
          <p>Add a new task to your workflow and stay organized.</p>
        </div>
      </section>

      <TaskForm onSubmit={handleSubmit} />
    </div>
  );
}
