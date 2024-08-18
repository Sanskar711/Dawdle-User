import React, { useEffect, useState } from 'react';
import './Dashboard.css'; // Import the CSS file for styling
import api from '../context/api';
import { useAuth } from '../context/Authcontext';
import { useNavigate } from 'react-router-dom';
import MeetingsCard from './Meetings';

const Dashboard = () => {
  const { userProfile, isAuthenticated, fetchUserProfile } = useAuth();
  const [meetingsSet, setMeetingsSet] = useState(0);
  const [dealsClosed, setDealsClosed] = useState(0);
    const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProfile();
      fetchPerformanceMetrics();
    }
    else{
        navigate('/login')
    }
  }, [isAuthenticated]);

  const fetchPerformanceMetrics = async () => {
    try {
      const response = await api.get('/users/meetings/');  // Adjust the endpoint as necessary
      const meetings = response.data;
      const meetingsSetCount = meetings.length;
      const dealsClosedCount = meetings.filter(meeting => meeting.status === 'completed').length;

      setMeetingsSet(meetingsSetCount);
      setDealsClosed(dealsClosedCount);
    } catch (err) {
      console.error('Error fetching performance metrics:', err);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="user-profile-dashboard">
        <img src="https://placehold.it/120x120" alt="User Avatar" className="avatar" />
        <h2>{userProfile?.first_name || "Sam Rock"}</h2>
        <p>{userProfile?.email || "samrock@gmail.com"}</p>
        <p>{userProfile?.phone_number || "+1 123456789"}</p>
        <p>{userProfile?.designation || "Sales Executive"}</p>
        <p>{userProfile?.company || "ABCCo"}</p>
      </div>

      <div className="performance-metrics">
        <h1 className="title">Performance Metrics</h1>
        <p className="subtitle">Track your sales performance data</p>
        <div className="metrics">
          <div className="metric-item">
            <span className="metric-number">{meetingsSet}</span>
            <span className="metric-label">Meetings Set</span>
          </div>
          <div className="metric-item">
            <span className="metric-number">{dealsClosed}</span>
            <span className="metric-label">Deals Closed</span>
          </div>
        </div>
      </div>

      { <MeetingsCard /> }
    </div>
  );
};

export default Dashboard;