import React, { useState, useEffect } from 'react';
import './Meetings.css';
import users from '../context/api';
import { useNavigate } from 'react-router-dom';

const MeetingsCard = ({ filterBy, title }) => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productNames, setProductNames] = useState({});
  const [prospectNames, setProspectNames] = useState({});
  const [sorted, setSorted] = useState(false); // New state for sorting order
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await users.get('/users/meetings/');
        const filteredMeetings = response.data.filter(meeting => meeting.status === filterBy);
        const sortedMeetings = sortMeetings(filteredMeetings, sorted);
        setMeetings(sortedMeetings);

        // Extract product and prospect IDs
        const productIds = [...new Set(filteredMeetings.map(meeting => meeting.product).filter(id => id !== null))];
        const prospectIds = [...new Set(filteredMeetings.map(meeting => meeting.prospect).filter(id => id !== null))];

        // Fetch and set product names
        const productNamesMap = await fetchProductNames(productIds);
        setProductNames(productNamesMap);

        // Fetch and set prospect names
        const prospectNamesMap = await fetchProspectNames(prospectIds);
        setProspectNames(prospectNamesMap);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, [filterBy, sorted]);

  const sortMeetings = (meetings, ascending) => {
    return meetings.sort((a, b) => {
      return ascending
        ? new Date(a.scheduled_at) - new Date(b.scheduled_at)
        : new Date(b.scheduled_at) - new Date(a.scheduled_at);
    });
  };

  const fetchProductNames = async (productIds) => {
    const productNamesMap = {};
    await Promise.all(
      productIds.map(async (productId) => {
        try {
          const response = await users.get(`users/product/${productId}/info/`);
          console.log(response.data)
          productNamesMap[productId] = response.data.name;
        } catch (err) {
          console.error(`Error fetching product info for ID ${productId}:`, err);
          productNamesMap[productId] = "Unknown Product";
        }
      })
    );
    return productNamesMap;
  };

  const fetchProspectNames = async (prospectIds) => {
    const prospectNamesMap = {};
    await Promise.all(
      prospectIds.map(async (prospectId) => {
        try {
          const response = await users.get(`users/prospect/${prospectId}/info/`);
          prospectNamesMap[prospectId] = response.data.company_name;
        } catch (err) {
          console.error(`Error fetching prospect info for ID ${prospectId}:`, err);
          prospectNamesMap[prospectId] = "Unknown Prospect";
        }
      })
    );
    return prospectNamesMap;
  };

  const toggleSortOrder = () => {
    setSorted(!sorted);
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
      <h1 className="title">{title}</h1>
      <button onClick={toggleSortOrder}>
        Sort by Time ({sorted ? 'Latest First' : 'Earliest First'})
      </button>
      <div className="meetings-list">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="meeting-item" onClick={() => handleMeetingDetails(meeting.id)}>
            <strong>
              {meeting.prospect ? meeting.prospect.company_name || "Loading..." : "No Prospect Information"}
            </strong>
            <span>{new Date(meeting.scheduled_at).toLocaleString()}</span>
            <span>
              {meeting.product ? meeting.product.name || "Loading..." : "No Product Information"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetingsCard;
