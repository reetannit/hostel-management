import React from 'react';
import { Linkedin, Github, Facebook, Instagram, MapPin, Phone, Mail } from 'lucide-react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer" id="contact">
      <p>&copy; 2025 HostelHub Management System. All rights reserved.</p>
      <div className="footer-contact">
        <span className="contact-item">
          <MapPin size={16} /> 123 University Road, Kanpur, Uttar Pradesh
        </span>
        <span className="contact-item">
          <Phone size={16} /> +91-9101294883
        </span>
        <span className="contact-item">
          <Mail size={16} /> 240231025@hbtu.ac.in
        </span>
      </div>
      <div className="social-links">
        <a 
          href="https://www.linkedin.com/in/chandan-boruah-8b3281200" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="social-icon"
        >
          <Linkedin size={24} />
        </a>
        <a 
          href="https://github.com/chandan-cpu" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="social-icon"
        >
          <Github size={24} />
        </a>
        <a 
          href="https://www.facebook.com/your-profile" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="social-icon"
        >
          <Facebook size={24} />
        </a>
        <a 
          href="https://www.instagram.com/your-username" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="social-icon"
        >
          <Instagram size={24} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
