import React, { useState, useEffect } from 'react';
import './Meetings.css';  // Assuming you have a CSS file for styling
import api from '../context/api';
import { useNavigate } from 'react-router-dom';

const MeetingsCard = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await api.get('/users/meetings/');
        const sortedMeetings = sortMeetings(response.data);
        setMeetings(sortedMeetings);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []); // Empty dependency array means this runs once on mount

  const sortMeetings = (meetings) => {
    return meetings.sort((a, b) => {
      const statusOrder = ['scheduled', 'cancelled', 'completed'];
      const statusComparison = statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);

      if (statusComparison !== 0) return statusComparison;

      if (a.status === 'scheduled' && b.status === 'scheduled') {
        return new Date(b.scheduled_at) - new Date(a.scheduled_at);
      }

      return 0;
    });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  const handleMeetingDetails = (id) => {
    navigate(`/meetings/${id}`);
  };

  return (
    <div className="meetings-container">
      <h1 className="title">Meetings</h1>
      <div className="meetings-list">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="meeting-item" onClick={() => handleMeetingDetails(meeting.id)}>
            <strong>
              {meeting.prospect ? 
                `Prospect ID: ${meeting.prospect}` : 
                "No Prospect Information"
              }
            </strong>
            <span>
              {meeting.product ? 
                meeting.product.name : 
                "No Product Information"
              }
            </span>
            <span>{new Date(meeting.scheduled_at).toLocaleString()}</span>
            <span>{meeting.status}</span>
            <span>{`${meeting.poc_first_name} ${meeting.poc_last_name}`}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetingsCard;
