import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import api from '../context/api';
import { useAuth } from '../context/Authcontext';
import { useNavigate } from 'react-router-dom';
import MeetingsCard from './Meetings';

const Dashboard = () => {
  const { isAuthenticated, fetchUserProfile } = useAuth();
  const [meetingsScheduled, setMeetingsScheduled] = useState(0);
  const [dealsClosed, setDealsClosed] = useState(0);
  const [dealsCompleted, setDealsCompleted] = useState(0);
  const [meetingsPending, setMeetingsPending] = useState(0);
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
      setMeetingsPending(meetings.filter(meeting => meeting.status === 'pending').length);
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
      case 'pending':
        return 'Pending Meetings';
      default:
        return 'Meetings';
    }
  };

  return (
    <div className="dashboard-container">
      <div className="performance-metrics">
        <h1 className="title">Performance Metrics</h1>
        <div className="metrics">
          <div
            className={`metric-item ${selectedMetric === 'pending' ? 'selected' : ''}`}
            onClick={() => handleMetricClick('pending')}
          >
            <span className="metric-number">{meetingsPending}</span>
            <span className="metric-label">Meetings Pending</span>
          </div>
          <div
            className={`metric-item ${selectedMetric === 'scheduled' ? 'selected' : ''}`}
            onClick={() => handleMetricClick('scheduled')}
          >
            <span className="metric-number">{meetingsScheduled}</span>
            <span className="metric-label">Meetings Scheduled</span>
          </div>
          <div
            className={`metric-item ${selectedMetric === 'completed' ? 'selected' : ''}`}
            onClick={() => handleMetricClick('completed')}
          >
            <span className="metric-number">{dealsCompleted}</span>
            <span className="metric-label">Meetings Completed</span>
          </div>
          <div
            className={`metric-item ${selectedMetric === 'closed' ? 'selected' : ''}`}
            onClick={() => handleMetricClick('closed')}
          >
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
