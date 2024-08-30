import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './VerifiedHome.css';
import api from '../context/api';
import Arrow from '../images/Arrow.png';
import CalendarIcon from '../images/calendar-icon.png';
import placeholder from '../images/Placeholder.png';
import BookingModal from './BookingModal';

const VerifiedHome = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    api.get('/users/user-products/')
      .then(response => {
        setProducts(response.data);
        setFilteredProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('There was an error fetching the products!');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get('search');

    if (searchTerm) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [location.search, products]);

  const handleBookMeeting = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleModalAction = (action) => {
    const queryParams = new URLSearchParams({ productId: selectedProduct?.id });
    if (action === 'check') {
      navigate(`/product/${selectedProduct.id}/icp-qualifying-questions?${queryParams}`);
    } else {
      navigate(`/product/${selectedProduct.id}/options/book-meeting?${queryParams}`, {
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
      {filteredProducts.length === 0 ? (
        <div className="no-products">No assigned products</div>
      ) : (
        filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-info">
              <img
                src={product.client_logo ? `${api.defaults.baseURL}${product.client_logo}` : placeholder}
                alt={product.name}
                className="product-logo"
                onError={(e) => {
                  e.currentTarget.src = placeholder;
                  console.log(`${api.defaults.baseURL}${product.client_logo}`);
                }}  // Fallback in case of an error
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
                <img src={Arrow} alt="arrow" />
              </button>
            </div>
          </div>
        ))
      )}
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
