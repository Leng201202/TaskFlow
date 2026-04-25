import React from 'react';

export default function FilterBar({ filters, activeFilter, onFilterChange }) {
  return (
    <div className="filter-bar">
      {filters.map((filter) => (
        <button
          key={filter.value}
          className={`filter-tab ${activeFilter === filter.value ? 'active' : ''}`}
          onClick={() => onFilterChange(filter.value)}
        >
          {filter.icon && <span className="filter-icon">{filter.icon}</span>}
          {filter.label}
          {filter.count !== undefined && (
            <span className="filter-count">{filter.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}
