import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [careerGoal, setCareerGoal] = useState(user?.career_goal || '');
  const [message, setMessage] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSave = async () => {
    try {
      await updateProfile(name || undefined, careerGoal || undefined);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const joinedDate = new Date(user.joined_date).toLocaleDateString();

  return (
    <div style={{ width: '100%', padding: '40px 20px', overflow: 'auto' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '30px' }}>My Profile</h1>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '30px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}>
          {isEditing ? (
            <>
              <div className="input-group">
                <label>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Career Goal</label>
                <select
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontFamily: 'inherit',
                  }}
                >
                  <option>AI Engineer</option>
                  <option>Full Stack Developer</option>
                  <option>Python Developer</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleSave}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#51cf66',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setName(user.name);
                    setCareerGoal(user.career_goal);
                  }}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#f0f0f0',
                    color: '#333',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '30px' }}>
                <div>
                  <p style={{ color: '#999', fontSize: '13px', marginBottom: '5px' }}>Name</p>
                  <p style={{ fontSize: '18px', fontWeight: 600 }}>{user.name}</p>
                </div>

                <div>
                  <p style={{ color: '#999', fontSize: '13px', marginBottom: '5px' }}>Email</p>
                  <p style={{ fontSize: '18px', fontWeight: 600 }}>{user.email}</p>
                </div>

                <div>
                  <p style={{ color: '#999', fontSize: '13px', marginBottom: '5px' }}>Career Goal</p>
                  <p style={{ fontSize: '18px', fontWeight: 600 }}>{user.career_goal}</p>
                </div>

                <div>
                  <p style={{ color: '#999', fontSize: '13px', marginBottom: '5px' }}>Joined</p>
                  <p style={{ fontSize: '18px', fontWeight: 600 }}>{joinedDate}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#4c6ef5',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  ✏️ Edit Profile
                </button>
                <button
                  onClick={() => navigate('/daily')}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#51cf66',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  📊 Go to Daily Tracker
                </button>
              </div>
            </>
          )}

          {message && (
            <p style={{
              marginTop: '20px',
              padding: '12px',
              backgroundColor: message.includes('error') ? '#ffebee' : '#e8f5e9',
              color: message.includes('error') ? '#c62828' : '#2e7d32',
              borderRadius: '6px',
              fontSize: '14px',
            }}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
