import React, { createContext, useContext, useState, useEffect } from 'react';
import api from './api';  // Import the Axios instance
import Cookies from 'js-cookie';  // Use js-cookie for cookie management
import { jwtDecode } from 'jwt-decode';  // Import jwt-decode for decoding JWT tokens

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [userProfile, setUserProfile] = useState({});

  const checkAuth = () => {
    const token = Cookies.get('token');
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }
    
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
  
      if (decodedToken.exp < currentTime) {
        console.log("Token expired");
        Cookies.remove('token');
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
        setUserId(decodedToken.user_id);  // Ensure userId is set
        fetchUserProfile();
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      setIsAuthenticated(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const fetchUserProfile = async () => {
    // console.log(userId)
    if (!userId) return;

    try { 
      // console.log(userId)
      const response = await api.get(`/users/${userId}/profile/`);
      // console.log(response.data);
      setUserProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

  const register = async (formValues) => {
    try {
      const response = await api.post('/users/register/', formValues);
      console.log('User registered successfully', response.data);
    } catch (error) {
      console.error('There was an error registering the user!', error);
    }
  };

  const login = async (email) => {
    try {
      const response = await api.post('/users/signin/', { email });
      if (response.data.user_id) {
        setUserId(response.data.user_id);
      }
    } catch (error) {
      console.error('There was an error sending the OTP!', error);
    }
  };

  const verifyOtp = async (otp) => {
    try {
      if (!userId) {
        throw new Error('User ID is not defined');
      }
      const response = await api.post(`/users/verify_otp_login/${userId}/`, { code: otp });

      if (response.data.message === 'User verified successfully') {
        setIsAuthenticated(true);
        const token = response.data.token;
        Cookies.set('token', token, { expires: 1/24, secure: true, sameSite: 'Strict' });
        fetchUserProfile();
      }
    } catch (error) {
      console.error('There was an error verifying the OTP!', error);
    }
  };

  const logout = async () => {
    try {
      // await api.get('/users/logout/');
      setIsAuthenticated(false);
      Cookies.remove('token');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userProfile, login, verifyOtp, logout, register, checkAuth , userProfile, fetchUserProfile}}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
