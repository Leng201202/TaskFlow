import React from 'react';
import { FiCalendar, FiTrash2, FiCheck, FiRotateCcw, FiUser } from 'react-icons/fi';
import PriorityBadge from '../UI/PriorityBadge';
import './TaskCard.css';

// Derive a display status from the Prisma boolean + dueDate
function getDisplayStatus(task) {
  if (task.completed) return 'Completed';
  if (new Date(task.dueDate) < new Date()) return 'Missing';
  return 'Pending';
}

const statusStyles = {
  Completed: {
    color: 'var(--status-completed)',
    bg: 'var(--status-completed-bg)',
  },
  Missing: {
    color: 'var(--status-missing)',
    bg: 'var(--status-missing-bg)',
  },
  Pending: {
    color: 'var(--status-pending)',
    bg: 'var(--status-pending-bg)',
  },
};

export default function TaskCard({ task, onToggleCompleted, onDelete, showActions = true }) {
  const displayStatus = getDisplayStatus(task);
  const style = statusStyles[displayStatus];

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const priorityClass = `priority-${task.priority?.toLowerCase() || 'low'}`;
  const isOverdue = displayStatus === 'Missing';

  return (
    <div className={`task-card glass ${priorityClass} ${task.completed ? 'completed' : ''}`}>
      {/* Priority accent bar */}
      <div className="task-card-accent" />

      {/* Status pill (derived) */}
      <div className="task-card-header">
        <span
          className="status-badge"
          style={{ color: style.color, background: style.bg, border: `1px solid ${style.color}22` }}
        >
          <span className="status-dot" style={{ background: style.color }} />
          {displayStatus}
        </span>
        <PriorityBadge priority={task.priority} />
      </div>

      {/* Title (Prisma: title) */}
      <h3 className="task-card-title">{task.title}</h3>

      {/* Description (Prisma: description) */}
      {task.description && task.description.trim() !== '' && (
        <p className="task-card-desc">{task.description}</p>
      )}

      {/* Content preview (Prisma: content) */}
      {task.content && (
        <p className="task-card-content">{task.content}</p>
      )}

      {/* Meta row: due date + assignedTo count */}
      <div className="task-card-meta">
        <span className={`task-card-date ${isOverdue ? 'overdue' : ''}`}>
          <FiCalendar size={13} />
          {formatDate(task.dueDate)}
        </span>
        {task.assignedTo && task.assignedTo.length > 0 && (
          <span className="task-card-assigned">
            <FiUser size={13} />
            {task.assignedTo.length} assigned
          </span>
        )}
      </div>

      {showActions && (
        <div className="task-card-actions">
          <button
            className="task-action-btn toggle-btn"
            onClick={() => onToggleCompleted?.(task.id)}
            title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {task.completed ? (
              <><FiRotateCcw size={14} /> <span>Reopen</span></>
            ) : (
              <><FiCheck size={14} /> <span>Complete</span></>
            )}
          </button>
          <button
            className="task-action-btn delete-btn"
            onClick={() => onDelete?.(task.id)}
            title="Delete task"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
