import React from 'react';
import { GALLERY_ITEMS } from '../../data/constants';
import './Gallery.css';

const Gallery = () => {
  return (
    <section className="gallery" id="gallery">
      <h2 className="section-title">Our Gallery</h2>
      <p className="section-subtitle">Take a virtual tour of our facilities</p>
      <div className="gallery-grid">
        {GALLERY_ITEMS.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div key={index} className="gallery-item">
              <div 
                className="gallery-background"
                style={{ background: item.gradient }}
              >
                <div className="gallery-icon">
                  <IconComponent size={64} strokeWidth={2} />
                </div>
              </div>
              <div className="gallery-overlay">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Gallery;