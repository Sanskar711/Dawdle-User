// src/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const [role, setRole] = useState('individual');
  const [formValues, setFormValues] = useState({
    email: '',
    firstName: '',
    lastName: '',
    designation: '',
    linkedin: '',
    phone: '',
    companyName: ''
  });

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/users/register', {
        email: formValues.email,
        role: role,
        first_name: formValues.firstName,
        last_name: formValues.lastName,
        designation: formValues.designation,
        linkedin: formValues.linkedin,
        phone: formValues.phone,
        company_name: formValues.companyName
      });
      console.log(response.data);
      // Handle successful registration (e.g., show a success message, redirect to login page)
    } catch (error) {
      console.error('There was an error registering the user!', error);
      // Handle registration error (e.g., show an error message)
    }
  };

  return (
    <div className="register-container">
      <div className="register-logo">Dawdle</div>
      <h2>Create a new account</h2>
      <p>Already have an account? <a href="/login">Sign in</a></p>
      <form className="register-form" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formValues.email}
          onChange={handleInputChange}
          required
        />
        <div className="role-selector">
          <button
            type="button"
            className={role === 'individual' ? 'active' : ''}
            onClick={() => handleRoleChange('individual')}
          >
            Individual
          </button>
          <button
            type="button"
            className={role === 'organization' ? 'active' : ''}
            onClick={() => handleRoleChange('organization')}
          >
            Organization
          </button>
        </div>
        {role === 'organization' && (
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={formValues.companyName}
            onChange={handleInputChange}
            required
          />
        )}
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formValues.firstName}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formValues.lastName}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="designation"
          placeholder="Designation"
          value={formValues.designation}
          onChange={handleInputChange}
        />
        <input
          type="url"
          name="linkedin"
          placeholder="LinkedIn"
          value={formValues.linkedin}
          onChange={handleInputChange}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone No."
          value={formValues.phone}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
