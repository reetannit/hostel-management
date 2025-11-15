import React, { useState } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = ({ scrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (section) => {
    scrollToSection(section);
    setIsMenuOpen(false); // Close menu after clicking
  };

  return (
    <nav className="navbar h-18">
      <div className="nav-container">
        <div className="logo">
          <div className="logo-icon">
            <img src="https://hbtu.ac.in/wp-content/uploads/2024/07/hbtu-logo-1.jpg" alt="HBTU Logo" />
          </div>
          <div className="logo-text">
            <span className="logo-hostel">Hostel</span>
            <span className="logo-hub">Hub</span>
          </div>
        </div>

        {/* Hamburger Menu Button */}
        <button 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Links */}
        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <a href="#home" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}>
              Home
            </a>
          </li>
          <li>
            <a href="#features" onClick={(e) => { e.preventDefault(); handleNavClick('features'); }}>
              Features
            </a>
          </li>
          <li>
            <a href="#hostels" onClick={(e) => { e.preventDefault(); handleNavClick('hostels'); }}>
              Hostels
            </a>
          </li>
          <li>
            <a href="#gallery" onClick={(e) => { e.preventDefault(); handleNavClick('gallery'); }}>
              Gallery
            </a>
          </li>
          <li>
            <a href="#testimonials" onClick={(e) => { e.preventDefault(); handleNavClick('testimonials'); }}>
              Testimonials
            </a>
          </li>
          <li>
            <a href="#contact" onClick={(e) => { e.preventDefault(); handleNavClick('contact'); }}>
              Contact
            </a>
          </li>
          <li>
            <a 
              href="https://hostel-management-system-admin2.onrender.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="admin-btn"
              onClick={() => setIsMenuOpen(false)}
            >
              Admin
            </a>
          </li>
          <li>
            <Link to="/login" className="login-btn" onClick={() => setIsMenuOpen(false)}>
              Login
            </Link>
          </li>
        </ul>

        {/* Mobile Overlay */}
        {isMenuOpen && (
          <div className="mobile-overlay" onClick={toggleMenu}></div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;