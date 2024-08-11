// src/components/VerifiedHome.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './VerifiedHome.css';
import api from '../context/api';  // Use the centralized Axios instance
import Arrow from '../images/Arrow.png';
import CalendarIcon from '../images/calendar-icon.png'; // Make sure to update the path to the correct location

const VerifiedHome = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/users/user-products/')
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('There was an error fetching the products!');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="product-list">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <div className="product-info">
            <img src={product.logo || 'placeholder.png'} alt={product.name} className="product-logo" />
            <div>
              <h3>{product.name}</h3>
              <p>{product.client.company_profile}</p>
            </div>
          </div>
          <div className="button-group">
            <button className="book-meeting-btn">
              <img src={CalendarIcon} alt="calendar" className="icon" />
              Book Meeting
            </button>
            <button 
              className="arrow-btn"
              onClick={() => navigate(`/product/${product.id}/options`)}
            >
              <img src={Arrow} alt="arrow"/>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VerifiedHome;
