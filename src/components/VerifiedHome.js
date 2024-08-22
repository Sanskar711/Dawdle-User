import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './VerifiedHome.css';
import api from '../context/api';  // Use the centralized Axios instance
import Arrow from '../images/Arrow.png';
import CalendarIcon from '../images/calendar-icon.png'; // Make sure to update the path to the correct location
import placeholder from '../images/Placeholder.png';  // Placeholder image
import BookingModal from './BookingModal';

const VerifiedHome = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
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

  const handleBookMeeting = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleModalAction = (action) => {
    if (action === 'check') {
      navigate(`/product/${selectedProduct.id}/icp-qualifying-questions`);
    } else {
      navigate(`/product/${selectedProduct.id}/options/book-meeting`, {
        state: {
          productName: selectedProduct.name,
          companyName: selectedProduct.client_name,
        },
      });
    }
    handleModalClose();
  };

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
            <img 
              src={product.client_logo ? `${api.defaults.baseURL}${product.client_logo}` : placeholder}    
              alt={product.name} 
              className="product-logo" 
            />
            <div>
              <h3>{product.name}</h3>
            </div>
          </div>
          <div className="button-group">
            <button 
              className="book-meeting-btn" 
              onClick={() => handleBookMeeting(product)}
            >
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
      {showModal && (
        <BookingModal 
          onClose={handleModalClose} 
          onAction={handleModalAction} 
          productName={selectedProduct?.name}
        />
      )}
    </div>
  );
};

export default VerifiedHome;
