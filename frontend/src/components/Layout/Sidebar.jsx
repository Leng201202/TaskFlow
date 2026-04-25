import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiPlusCircle, FiClock, FiUser, FiZap } from 'react-icons/fi';
import './Sidebar.css';

const navItems = [
  { to: '/', icon: <FiHome />, label: 'Dashboard' },
  { to: '/create', icon: <FiPlusCircle />, label: 'Create Task' },
  { to: '/history', icon: <FiClock />, label: 'Task History' },
  { to: '/profile', icon: <FiUser />, label: 'Profile' },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <FiZap />
          </div>
          <div className="sidebar-brand-text">
            <h1>TaskFlow</h1>
            <span>Task Manager</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <span className="sidebar-nav-label">Menu</span>
          <ul>
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                  onClick={onClose}
                >
                  <span className="sidebar-link-icon">{item.icon}</span>
                  <span className="sidebar-link-label">{item.label}</span>
                  <span className="sidebar-link-indicator" />
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-footer-card glass">
            <p className="sidebar-footer-title">TaskFlow v1.0</p>
            <p className="sidebar-footer-subtitle">Built with React & Zustand</p>
          </div>
        </div>
      </aside>
    </>
  );
}
