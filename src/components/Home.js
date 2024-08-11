import React, { useEffect, useState } from 'react';
import VerificationInProgress from './VerificationInProgress';
import VerifiedHome from './VerifiedHome';
import api from '../context/api';  // Use the centralized Axios instance
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';
// import './Home.css';  // Importing the CSS file

const Home = () => {
  const [isVerified, setIsVerified] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const {isAuthenticated} = useAuth();
  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        const response = await api.get('/users/verification-status/');
        setIsVerified(response.data.is_verified);
      } catch (error) {
        console.error('Error checking verification status', error);
        navigate('/login'); // Redirect to login page on error
      } finally {
        setLoading(false);
      }
    };
    if(isAuthenticated){
      checkVerificationStatus();
    }
  }, [navigate,isAuthenticated]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home-container">
      {isVerified ? <VerifiedHome /> : <VerificationInProgress />}
    </div>
  );
};

export default Home;
