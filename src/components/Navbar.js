import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import logo from '../images/logo.png';
import './Navbar.css';
import { useAuth } from '../context/Authcontext';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { logout, userProfile, isAuthenticated, fetchUserProfile,checkAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route
  const [searchTerm, setSearchTerm] = useState("");

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/login");
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  useEffect(() => {
    checkAuth();
    if (isAuthenticated) {
      fetchUserProfile();
      return;
    }
  }, [isAuthenticated]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Navigate to search results or call a search function
    navigate(`/home?search=${searchTerm}`);
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="Dawdle" className="logo-image" />
      </div>
      <div className="hamburger" onClick={toggleMobileMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul className={`nav-links ${isMobileMenuOpen ? 'show' : ''}`}>
        <li className="nav-item">
          <NavLink className="nav-link" exact to='/home' activeClassName="active">Home</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" exact to='/dashboard' activeClassName="active">Dashboard</NavLink>
        </li>
      </ul>
      {location.pathname === '/home' && ( // Render search bar only on home route
        <div className="search-container">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search Products"
              className="search-input"
              aria-label="Search Products"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </form>
        </div>
      )}
      <div className="user-profile" onClick={toggleDropdown} ref={dropdownRef}>
        <span className="user-name">{userProfile.first_name}</span>
        <div className={`dropdown-icon ${dropdownOpen ? 'open' : ''}`} aria-hidden="true">▼</div>
        {dropdownOpen && (
          <div className="dropdown-menu">
            <Link to="/profile" className="dropdown-item">Profile</Link>
            <Link to="/logout" className="dropdown-item" onClick={handleLogout}>Logout</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
