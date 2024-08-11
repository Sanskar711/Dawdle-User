import React, { useState, useEffect } from 'react';
import './Profile.css';
import { getCookie } from '../context/utils';
import api from '../context/api';
import { useAuth } from '../context/Authcontext';

const Profile = () => {
  const { userProfile, fetchUserProfile } = useAuth();
  const [profile, setProfile] = useState(userProfile);
  const [isEditing, setIsEditing] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getCookie('token');
    try {
      await api.put(`/users/${profile.id}/profile/`, profile, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Profile updated successfully!');
      setIsEditing(false);
      fetchUserProfile(); // Fetch updated profile
    } catch (error) {
      console.error('There was an error updating the profile!', error);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-form">
        <h2>Edit Profile</h2>
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
            Email:
            <input
              type="email"
              name="email"
              value={profile.email || ''}
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
          <label>
            User Type:
            <input
              type="text"
              name="user_type"
              value={profile.user_type || ''}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </label>
          {isEditing ? (
            <button type="submit">Save</button>
          ) : (
            <button type="button" onClick={handleEditClick}>Edit Profile</button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
