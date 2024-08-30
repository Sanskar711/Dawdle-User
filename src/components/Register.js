import React, { useState, useEffect } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';

const Register = () => {
  const { isAuthenticated, register, error, setError } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('individual');
  const [formValues, setFormValues] = useState({
    email: '',
    firstName: '',
    lastName: '',
    linkedin: '',
    phone: '',
    designation: '',
    companyName: ''
  });
  const [alertMessage, setAlertMessage] = useState(''); 
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [isPopupVisible, setIsPopupVisible] = useState(false); 

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      setAlertMessage(error);
      setIsPopupVisible(true);
      setTimeout(() => {
        setIsPopupVisible(false);
        setError(null); 
      }, 2000);  // Reduced to 2 seconds
    }
  }, [error, setError]);

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'individual') {
      setFormValues({ ...formValues, designation: '', companyName: '' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const success = await register({
      first_name: formValues.firstName,
      last_name: formValues.lastName,
      email: formValues.email,
      phone_number: formValues.phone,
      user_type: role,
      linkedin_id: formValues.linkedin,
      designation: role === 'organization' ? formValues.designation : '',
      company_name: role === 'organization' ? formValues.companyName : ''
    });

    if (success) {
      setAlertMessage('Registration successful! Redirecting to login page...');
      setIsPopupVisible(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);  // Reduced to 2 seconds
    } else {
      setAlertMessage(error);  
      setIsPopupVisible(true);
      setTimeout(() => {
        setIsPopupVisible(false);
        setError(null); 
      }, 2000);  // Reduced to 2 seconds
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-logo">Dawdle</div>
      <h2>Create a new account</h2>
      <p>Already have an account? <a href="/user/login">Sign in</a></p>
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
            disabled={isSubmitting} 
          >
            Individual
          </button>
          <button
            type="button"
            className={role === 'organization' ? 'active' : ''}
            onClick={() => handleRoleChange('organization')}
            disabled={isSubmitting} 
          >
            Organization
          </button>
        </div>
        {role === 'organization' && (
          <>
            <input
              type="text"
              name="companyName"
              placeholder="Company Name"
              value={formValues.companyName}
              onChange={handleInputChange}
              required
              disabled={isSubmitting} 
            />
            <input
              type="text"
              name="designation"
              placeholder="Designation"
              value={formValues.designation}
              onChange={handleInputChange}
              disabled={isSubmitting} 
            />
          </>
        )}
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formValues.firstName}
          onChange={handleInputChange}
          required
          disabled={isSubmitting} 
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formValues.lastName}
          onChange={handleInputChange}
          required
          disabled={isSubmitting} 
        />
        <input
          type="url"
          name="linkedin"
          placeholder="LinkedIn"
          value={formValues.linkedin}
          onChange={handleInputChange}
          disabled={isSubmitting} 
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone No."
          value={formValues.phone}
          onChange={handleInputChange}
          required
          disabled={isSubmitting} 
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>
      {isPopupVisible && (
        <div className={`popup-alert show ${error ? 'error' : ''}`}>
          {alertMessage}
        </div>
      )}
    </div>
  );
};

export default Register;
