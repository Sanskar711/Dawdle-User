import React, { useState, useEffect } from 'react';
import Otp from './Otp';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext'; // Correct path

const Login = () => {
  const [email, setEmail] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const { isAuthenticated, login, error, setError, checkAuth } = useAuth(); // Assuming setError is exposed from context
  const navigate = useNavigate();
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  useEffect(() => {
    checkAuth();
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    if (error) {
      setError(null); // Clear error when email input changes
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSendingOtp(true); // Disable the button and change text
    login(email).then((loginSuccessful) => {
      if (loginSuccessful) {
        setIsOtpModalOpen(true);
      }
      setIsSendingOtp(false); // Re-enable the button after the operation
    }).catch(() => {
      setIsSendingOtp(false); // Re-enable the button if login fails
    });
  };

  const handleOtpResend = (e) => {
    login(email);
    alert("OTP Resent");
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
        <button
          type="submit"
          className={isSendingOtp ? 'sending-otp' : ''}
          disabled={isSendingOtp}
        >
          {isSendingOtp ? 'Sending OTP...' : 'Send OTP'}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
      <p>Don't have an account? <a href="/user/register">Register</a></p>
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
