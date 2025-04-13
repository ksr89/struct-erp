import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import { UserRole } from '../types/auth';

const Settings: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ firstName, lastName, password, role });
    navigate('/');
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-6">
        <h1 className="text-2xl font-bold mb-4">Profile Settings</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">First Name:</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Last Name:</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password:</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Reset your password"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Role:</label>
            <select
              className="w-full p-2 border rounded"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Select Role</option>
              {Object.values(UserRole).map((roleValue) => (
                <option key={roleValue} value={roleValue}>
                  {roleValue.charAt(0).toUpperCase() + roleValue.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
