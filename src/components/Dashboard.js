import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import dummyProfile from '../images/user_default.jpg';
import api from '../context/api';
import { useAuth } from '../context/Authcontext';
import { useNavigate } from 'react-router-dom';
import MeetingsCard from './Meetings';

const Dashboard = () => {
  const { userProfile, isAuthenticated, fetchUserProfile } = useAuth();
  const [meetingsScheduled, setMeetingsScheduled] = useState(0);
  const [dealsClosed, setDealsClosed] = useState(0);
  const [dealsCompleted, setDealsCompleted] = useState(0);
  const [selectedMetric, setSelectedMetric] = useState('scheduled');
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProfile();
      fetchPerformanceMetrics();
    } else {
      navigate('/login');
    }
  }, [isAuthenticated]);

  const fetchPerformanceMetrics = async () => {
    try {
      const response = await api.get('/users/meetings/');
      const meetings = response.data;
      setMeetingsScheduled(meetings.filter(meeting => meeting.status === 'scheduled').length);
      setDealsClosed(meetings.filter(meeting => meeting.status === 'closed').length);
      setDealsCompleted(meetings.filter(meeting => meeting.status === 'completed').length);
    } catch (err) {
      console.error('Error fetching performance metrics:', err);
    }
  };

  const handleMetricClick = (metric) => {
    setSelectedMetric(metric);
  };

  const getMetricTitle = () => {
    switch (selectedMetric) {
      case 'scheduled':
        return 'Scheduled Meetings';
      case 'completed':
        return 'Completed Meetings';
      case 'closed':
        return 'Closed Deals';
      default:
        return 'Meetings';
    }
  };

  return (
    <div className="dashboard-container">
      <div className="user-profile-dashboard">
        {/* User Profile Details */}
        <img src={dummyProfile} alt="User Avatar" className="avatar" />
        <h2>{userProfile?.first_name || "Sam Rock"}</h2>
        <p>{userProfile?.email || "samrock@gmail.com"}</p>
        <p>{userProfile?.phone_number || "+1 123456789"}</p>
        <p>{userProfile?.designation || ""}</p>
        <p>{userProfile?.company || ""}</p>
      </div>

      <div className="performance-metrics">
        <h1 className="title">Performance Metrics</h1>
        <p className="subtitle">Track your sales performance data</p>
        <div className="metrics">
          <div className="metric-item" onClick={() => handleMetricClick('scheduled')}>
            <span className="metric-number">{meetingsScheduled}</span>
            <span className="metric-label">Meetings Scheduled</span>
          </div>
          <div className="metric-item" onClick={() => handleMetricClick('completed')}>
            <span className="metric-number">{dealsCompleted}</span>
            <span className="metric-label">Meetings Completed</span>
          </div>
          <div className="metric-item" onClick={() => handleMetricClick('closed')}>
            <span className="metric-number">{dealsClosed}</span>
            <span className="metric-label">Deals Closed</span>
          </div>
        </div>
      </div>

      <MeetingsCard filterBy={selectedMetric} title={getMetricTitle()} />
    </div>
  );
};

export default Dashboard;
