import React, { useState, useMemo } from 'react';
import {
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
  FiList,
} from 'react-icons/fi';
import useTaskStore from '../stores/useTaskStore';
import TaskCard from '../components/Tasks/TaskCard';
import FilterBar from '../components/UI/FilterBar';
import '../components/UI/UI.css';
import './TaskHistoryPage.css';

export default function TaskHistoryPage() {
  const { tasks, toggleCompleted, deleteTask } = useTaskStore();
  const [activeFilter, setActiveFilter] = useState('all');

  const now = new Date();

  // Completed = completed: true
  const completedTasks = useMemo(
    () => tasks.filter((t) => t.completed),
    [tasks]
  );

  // Missing = not completed AND past due date (Prisma: !completed && dueDate < now)
  const missingTasks = useMemo(
    () => tasks.filter((t) => !t.completed && new Date(t.dueDate) < now),
    [tasks]
  );

  // Active/Pending = not completed AND not past due
  const activeTasks = useMemo(
    () => tasks.filter((t) => !t.completed && new Date(t.dueDate) >= now),
    [tasks]
  );

  const filters = [
    { value: 'all',       label: 'All Tasks',  icon: <FiList />,          count: tasks.length },
    { value: 'completed', label: 'Completed',  icon: <FiCheckCircle />,   count: completedTasks.length },
    { value: 'missing',   label: 'Missing',    icon: <FiAlertTriangle />, count: missingTasks.length },
    { value: 'active',    label: 'Active',     icon: <FiClock />,         count: activeTasks.length },
  ];

  const getFilteredTasks = () => {
    switch (activeFilter) {
      case 'completed': return completedTasks;
      case 'missing':   return missingTasks;
      case 'active':    return activeTasks;
      default:          return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  const cardProps = (task) => ({
    key: task.id,
    task,
    onToggleCompleted: toggleCompleted,
    onDelete: deleteTask,
  });

  return (
    <div className="history-page">
      <section className="page-header animate-fade-in">
        <div className="page-header-icon">
          <FiClock />
        </div>
        <div>
          <h1>Task History</h1>
          <p>Review completed, active, and missed tasks.</p>
        </div>
      </section>

      <FilterBar
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {/* Sectioned view when "All" selected */}
      {activeFilter === 'all' ? (
        <div className="history-sections">
          {completedTasks.length > 0 && (
            <section className="history-section">
              <div className="history-section-header completed-header">
                <FiCheckCircle />
                <h2>Completed Tasks</h2>
                <span className="section-count">{completedTasks.length}</span>
              </div>
              <div className="tasks-grid stagger">
                {completedTasks.map((task) => <TaskCard {...cardProps(task)} />)}
              </div>
            </section>
          )}

          {missingTasks.length > 0 && (
            <section className="history-section">
              <div className="history-section-header missing-header">
                <FiAlertTriangle />
                <h2>Missing Tasks</h2>
                <span className="section-count">{missingTasks.length}</span>
              </div>
              <div className="tasks-grid stagger">
                {missingTasks.map((task) => <TaskCard {...cardProps(task)} />)}
              </div>
            </section>
          )}

          {activeTasks.length > 0 && (
            <section className="history-section">
              <div className="history-section-header pending-header">
                <FiClock />
                <h2>Active Tasks</h2>
                <span className="section-count">{activeTasks.length}</span>
              </div>
              <div className="tasks-grid stagger">
                {activeTasks.map((task) => <TaskCard {...cardProps(task)} />)}
              </div>
            </section>
          )}

          {tasks.length === 0 && (
            <div className="empty-state glass">
              <div className="empty-icon">📋</div>
              <h3>No task history yet</h3>
              <p>Your tasks will appear here once created.</p>
            </div>
          )}
        </div>
      ) : (
        /* Flat filtered list */
        <div className="history-sections">
          {filteredTasks.length === 0 ? (
            <div className="empty-state glass">
              <div className="empty-icon">🔍</div>
              <h3>No tasks found</h3>
              <p>No tasks match the current filter.</p>
            </div>
          ) : (
            <div className="tasks-grid stagger">
              {filteredTasks.map((task) => <TaskCard {...cardProps(task)} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
