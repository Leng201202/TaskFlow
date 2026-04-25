import React, { useState } from 'react';
import { FiSend, FiAlertCircle } from 'react-icons/fi';
import useUserStore from '../../stores/useUserStore';
import './TaskForm.css';

const initialForm = {
  title: '',
  description: '',
  content: '',
  dueDate: '',
  priority: 'Medium',
  assignedTo: [], // array of User ids (string[])
};

export default function TaskForm({ onSubmit }) {
  const { user } = useUserStore();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Task title is required';
    if (!form.content.trim()) errs.content = 'Content is required';
    if (!form.dueDate) errs.dueDate = 'Due date is required';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    // Build task payload matching Prisma Task schema
    onSubmit({
      title: form.title,
      description: form.description,
      content: form.content,
      dueDate: form.dueDate,
      priority: form.priority,
      createdById: user.id,
      assignedTo: form.assignedTo,
    });

    setSubmitted(true);
    setForm(initialForm);
    setErrors({});
    setTimeout(() => setSubmitted(false), 2500);
  };

  return (
    <form className="task-form glass" onSubmit={handleSubmit}>
      {submitted && (
        <div className="form-success animate-fade-in">
          <FiSend />
          <span>Task created successfully!</span>
        </div>
      )}

      {/* Title */}
      <div className={`form-group ${errors.title ? 'has-error' : ''}`}>
        <label htmlFor="task-title">Task Title</label>
        <input
          type="text"
          id="task-title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Design the landing page"
          autoComplete="off"
        />
        {errors.title && (
          <span className="form-error">
            <FiAlertCircle size={13} /> {errors.title}
          </span>
        )}
      </div>

      {/* Description */}
      <div className="form-group">
        <label htmlFor="task-description">Description <span className="label-hint">(optional)</span></label>
        <input
          type="text"
          id="task-description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Short summary of the task"
          autoComplete="off"
        />
      </div>

      {/* Content */}
      <div className={`form-group ${errors.content ? 'has-error' : ''}`}>
        <label htmlFor="task-content">Content</label>
        <textarea
          id="task-content"
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Full task details, steps, notes..."
          rows={5}
        />
        {errors.content && (
          <span className="form-error">
            <FiAlertCircle size={13} /> {errors.content}
          </span>
        )}
      </div>

      {/* Due Date */}
      <div className={`form-group ${errors.dueDate ? 'has-error' : ''}`}>
        <label htmlFor="task-duedate">Due Date</label>
        <input
          type="date"
          id="task-duedate"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
        />
        {errors.dueDate && (
          <span className="form-error">
            <FiAlertCircle size={13} /> {errors.dueDate}
          </span>
        )}
      </div>

      {/* Priority */}
      <div className="form-group">
        <label>Priority Level</label>
        <div className="priority-selector">
          {['Low', 'Medium', 'High'].map((level) => (
            <button
              key={level}
              type="button"
              className={`priority-option ${form.priority === level ? 'selected' : ''} priority-${level.toLowerCase()}`}
              onClick={() => setForm((prev) => ({ ...prev, priority: level }))}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Created By (read-only display) */}
      <div className="form-group">
        <label>Created By</label>
        <input
          type="text"
          value={user.name}
          readOnly
          className="input-readonly"
        />
      </div>

      {/* Submit */}
      <button type="submit" className="form-submit">
        <FiSend size={16} />
        Create Task
      </button>
    </form>
  );
}
