import React, { useState } from 'react';
import {
  FiUser,
  FiEdit3,
  FiSave,
  FiX,
  FiMail,
  FiFileText,
} from 'react-icons/fi';
import useUserStore from '../stores/useUserStore';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, updateUser } = useUserStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ 
    name: user?.name || '', 
    email: user?.email || '', 
    bio: user?.bio || '' 
  });
  const [saved, setSaved] = useState(false);

  if (!user) {
    return (
      <div className="profile-page">
        <section className="page-header animate-fade-in">
          <div className="page-header-icon"><FiUser /></div>
          <div>
            <h1>Profile</h1>
            <p>Please log in to view your profile.</p>
          </div>
        </section>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateUser(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCancel = () => {
    setForm({ name: user.name, email: user.email, bio: user.bio });
    setEditing(false);
  };

  // Initials from Prisma `name` field (single name field)
  const initials = (user.name || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="profile-page">
      <section className="page-header animate-fade-in">
        <div className="page-header-icon">
          <FiUser />
        </div>
        <div>
          <h1>My Profile</h1>
          <p>Manage your personal information.</p>
        </div>
      </section>

      {saved && (
        <div className="form-success animate-fade-in" style={{ maxWidth: 600 }}>
          <FiSave />
          <span>Profile updated successfully!</span>
        </div>
      )}

      <div className="profile-card glass">
        {/* Avatar & Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            <span>{initials}</span>
          </div>
          <div className="profile-header-info">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>
          {!editing ? (
            <button className="profile-edit-btn" onClick={() => setEditing(true)}>
              <FiEdit3 size={15} />
              Edit Profile
            </button>
          ) : (
            <div className="profile-edit-actions">
              <button className="profile-save-btn" onClick={handleSave}>
                <FiSave size={15} /> Save
              </button>
              <button className="profile-cancel-btn" onClick={handleCancel}>
                <FiX size={15} /> Cancel
              </button>
            </div>
          )}
        </div>

        {/* Profile Fields — matches Prisma User: name, email */}
        <div className="profile-fields">
          <div className="profile-field">
            <label>
              <FiUser size={14} />
              Name
            </label>
            {editing ? (
              <input type="text" name="name" value={form.name} onChange={handleChange} />
            ) : (
              <p>{user.name}</p>
            )}
          </div>

          <div className="profile-field">
            <label>
              <FiMail size={14} />
              Email
            </label>
            {editing ? (
              <input type="email" name="email" value={form.email} onChange={handleChange} />
            ) : (
              <p>{user.email}</p>
            )}
          </div>

          <div className="profile-field">
            <label>
              <FiFileText size={14} />
              Bio
            </label>
            {editing ? (
              <textarea name="bio" value={form.bio} onChange={handleChange} rows={3} />
            ) : (
              <p>{user.bio || 'No bio added yet.'}</p>
            )}
          </div>

          {/* Read-only: ID (used as createdById on tasks) */}
          <div className="profile-field">
            <label>User ID</label>
            <p className="profile-id">{user.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
