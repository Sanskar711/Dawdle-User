// src/components/LandingPage.js

import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';
import { useAuth } from '../context/Authcontext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1>Welcome!</h1>
        <p>Are you a new user?</p>
        <div className="button-group">
          <Link to="/login" className="btn">Sign In</Link>
          <Link to="/register" className="btn">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
