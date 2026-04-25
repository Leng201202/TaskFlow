import React from 'react';
import { FiFlag } from 'react-icons/fi';

const priorityConfig = {
  Low: {
    color: 'var(--priority-low)',
    label: 'Low',
  },
  Medium: {
    color: 'var(--priority-medium)',
    label: 'Medium',
  },
  High: {
    color: 'var(--priority-high)',
    label: 'High',
  },
};

export default function PriorityBadge({ priority }) {
  const config = priorityConfig[priority] || priorityConfig.Low;

  return (
    <span
      className="priority-badge"
      style={{ color: config.color }}
    >
      <FiFlag size={13} />
      {config.label}
    </span>
  );
}
