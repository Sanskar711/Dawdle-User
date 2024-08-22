import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './VerifiedHome.css';
import api from '../context/api';
import Arrow from '../images/Arrow.png';
import CalendarIcon from '../images/calendar-icon.png';
import placeholder from '../images/Placeholder.png';

const VerifiedHome = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

  const handleBookMeeting = (id, productName, companyName) => {
    navigate(`/product/${id}/options/book-meeting`, {
      state: {
        productName: productName,
        companyName: companyName,
      },
    });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="product-list">
      {filteredProducts.map((product) => (
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
            <button className="book-meeting-btn" onClick={() => handleBookMeeting(product.id, product.name, product.client_name)}>
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
      ))}
    </div>
  );
};

export default VerifiedHome;
