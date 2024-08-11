// src/components/OptionList.js
import React from 'react';
import { useParams, useNavigate} from 'react-router-dom';
// import api from '../context/api';  // Use the centralized Axios instance
import './OptionList.css';
import aboutCompany from '../images/Office.png';
import useCases from '../images/Project Management.png';
import viewProspect from '../images/User Account.png';
import calendar from '../images/Calendar Plus.png';
import goBack from '../images/Group 20.png';
import forward from '../images/Forward.png';
const OptionList = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  
   // Get the dynamic 'id' parameter from the URL
  const handleAboutClick = () => {
    navigate(`/product/${productId}/options/productpage`);
  };
  const handleViewProspect = ()=>{
    navigate(`/product/${productId}/options/prospectList`);
  }
  const handleUseCases = ()=>{
    navigate(`/product/${productId}/options/useCases`);
  }
  return (
    <div className="option-list-container">
      <button className="go-back" onClick={() => navigate(-1) }>
        <img src={goBack} alt="Go Back" className="go-back-icon" />
      </button>
      <div className="option-list">
        <div className="option-item" onClick={handleAboutClick}>
          <img src={aboutCompany} alt="About" className="option-icon" />
          <span>About Product and Company</span>
          <img src={forward} alt="Forward" className="forward-icon" />
        </div>
        <div className="option-item" onClick={handleUseCases}>
          <img src={useCases} alt="Use Cases" className="option-icon" />
          <span>Use Cases / Problem Solved by Product</span>
          <img src={forward} alt="Forward" className="forward-icon" />
        </div>
        <div className="option-item" onClick={handleViewProspect}>
          <img src={viewProspect} alt="Prospects" className="option-icon" />
          <span>View Prospects</span>
          <img src={forward} alt="Forward" className="forward-icon" />
        </div>
        <div className="option-item">
          <img src={calendar} alt="Book Meeting" className="option-icon" />
          <span>Book Meeting</span>
          <img src={forward} alt="Forward" className="forward-icon" />
        </div>
      </div>
    </div>
  );
};

export default OptionList;
