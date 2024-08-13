import React, { useState, useEffect } from 'react';
import Otp from './Otp';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext'; // Correct path

const Login = () => {
  const [email, setEmail] = useState('');
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email);
    setIsOtpModalOpen(true);
  };

  const handleOtpResend = (e) => {
    login(email);
    alert("OTP Resent")
  };

  const handleClose = () => {
    setIsOtpModalOpen(false);
  };

  return (
    <div className="login-container">
      <div className="login-logo">Dawdle</div>
      <h2>Sign in</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Send OTP</button>
      </form>
      <p>Don't have an account? <a href="/register">Register</a></p>
      {isOtpModalOpen && (
        <Otp
          onResend={handleOtpResend}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default Login;
