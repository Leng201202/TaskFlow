import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiPlus,
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
  FiLayers,
} from 'react-icons/fi';
import useTaskStore from '../stores/useTaskStore';
import useUserStore from '../stores/useUserStore';
import TaskCard from '../components/Tasks/TaskCard';
import '../components/UI/UI.css';
import './HomePage.css';

export default function HomePage() {
  const { tasks, toggleCompleted, deleteTask, getStats } = useTaskStore();
  const { user } = useUserStore();
  const stats = getStats();
  const now = new Date();

  // Active = not completed AND not past due date
  const activeTasks = tasks.filter(
    (t) => !t.completed && new Date(t.dueDate) >= now
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const statItems = [
    {
      label: 'Total Tasks',
      value: stats.total,
      icon: <FiLayers />,
      color: 'var(--accent-primary)',
      bg: 'rgba(124, 58, 237, 0.1)',
    },
    {
      label: 'Active',
      value: stats.active,
      icon: <FiClock />,
      color: 'var(--status-pending)',
      bg: 'var(--status-pending-bg)',
    },
    {
      label: 'Missing',
      value: stats.missing,
      icon: <FiAlertTriangle />,
      color: 'var(--status-missing)',
      bg: 'var(--status-missing-bg)',
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: <FiCheckCircle />,
      color: 'var(--status-completed)',
      bg: 'var(--status-completed-bg)',
    },
  ];

  return (
    <div className="home-page">
      {/* ── Greeting Banner ───────────────────────────────── */}
      <section className="greeting-banner animate-fade-in">
        <div>
          <h1>
            {getGreeting()}, <span className="gradient-text">{user.name.split(' ')[0]}</span> 👋
          </h1>
          <p className="greeting-date">{today}</p>
        </div>
        <Link to="/create" className="create-btn">
          <FiPlus />
          New Task
        </Link>
      </section>

      {/* ── Stats Row ─────────────────────────────────────── */}
      <section className="stats-row stagger">
        {statItems.map((stat) => (
          <div className="stat-card glass" key={stat.label}>
            <div
              className="stat-icon"
              style={{ color: stat.color, background: stat.bg }}
            >
              {stat.icon}
            </div>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </section>

      {/* ── Active Tasks ──────────────────────────────────── */}
      <section className="tasks-section">
        <div className="section-header">
          <h2>Active Tasks</h2>
          <span className="section-count">{activeTasks.length} tasks</span>
        </div>

        {activeTasks.length === 0 ? (
          <div className="empty-state glass">
            <div className="empty-icon">🎉</div>
            <h3>All caught up!</h3>
            <p>You have no active tasks. Create one to get started.</p>
            <Link to="/create" className="create-btn small">
              <FiPlus />
              Create Task
            </Link>
          </div>
        ) : (
          <div className="tasks-grid stagger">
            {activeTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleCompleted={toggleCompleted}
                onDelete={deleteTask}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
