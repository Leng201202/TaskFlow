import React from 'react';

const statusConfig = {
  Pending: {
    color: 'var(--status-pending)',
    bg: 'var(--status-pending-bg)',
    label: 'Pending',
  },
  'In Progress': {
    color: 'var(--status-progress)',
    bg: 'var(--status-progress-bg)',
    label: 'In Progress',
  },
  Completed: {
    color: 'var(--status-completed)',
    bg: 'var(--status-completed-bg)',
    label: 'Completed',
  },
  Missing: {
    color: 'var(--status-missing)',
    bg: 'var(--status-missing-bg)',
    label: 'Missing',
  },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.Pending;

  return (
    <span
      className="status-badge"
      style={{
        color: config.color,
        background: config.bg,
        border: `1px solid ${config.color}22`,
      }}
    >
      <span
        className="status-dot"
        style={{ background: config.color }}
      />
      {config.label}
    </span>
  );
}
