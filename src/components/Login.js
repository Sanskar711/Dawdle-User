// src/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/users/login', { email });
      console.log(response.data);
      // Handle successful OTP send (e.g., show a success message, redirect to OTP verification page)
    } catch (error) {
      console.error('There was an error sending the OTP!', error);
      // Handle OTP send error (e.g., show an error message)
    }
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
    </div>
  );
};

export default Login;
