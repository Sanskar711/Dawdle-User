import React, { useState, useEffect } from 'react';
import './Profile.css';
import api from '../context/api';
import { useAuth } from '../context/Authcontext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { userProfile, fetchUserProfile,isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(userProfile);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
        navigate('/login');
    }
}, [isAuthenticated, navigate]);
  useEffect(() => {
    setProfile(userProfile); // Sync profile state with the context data
  }, [userProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setProfile(userProfile); // Revert changes by resetting to the original profile
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/users/${userProfile.id}/update-profile/`, profile);
      alert('Profile updated successfully!');
      setIsEditing(false);
      fetchUserProfile(); 
    } catch (error) {
      console.error('There was an error updating the profile!', error);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-form">
        <h2>{isEditing ? 'Edit Profile' : 'Profile'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            First Name:
            <input
              type="text"
              name="first_name"
              value={profile.first_name || ''}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </label>
          <label>
            Last Name:
            <input
              type="text"
              name="last_name"
              value={profile.last_name || ''}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </label>
          <label>
            Phone Number:
            <input
              type="text"
              name="phone_number"
              value={profile.phone_number || ''}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </label>
          <label>
            LinkedIn ID:
            <input
              type="text"
              name="linkedin_id"
              value={profile.linkedin_id || ''}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </label>
          {profile.designation && (
            <label>
              Designation:
              <input
                type="text"
                name="designation"
                value={profile.designation || ''}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </label>
          )}
          {profile.company_name && (
            <label>
              Company Name:
              <input
                type="text"
                name="company_name"
                value={profile.company_name || ''}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </label>
          )}
          {isEditing ? (
            <div className="profile-actions">
              <button type="submit">Save</button>
              <button type="button" onClick={handleCancelClick}>Cancel</button>
            </div>
          ) : (
            <button type="button" onClick={handleEditClick}>Edit Profile</button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
