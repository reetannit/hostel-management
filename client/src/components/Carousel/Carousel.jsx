import React, { useState, useEffect } from 'react';
import { SLIDES } from '../../data/constants';
import './Carousel.css';

const Carousel = ({ scrollToSection }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="carousel-container" id="home">
      {SLIDES.map((slide, index) => (
        <div key={index} className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}>
          <div
            className="carousel-background"
            style={{
              backgroundImage: slide.image ? `url('${slide.image}')` : slide.gradient,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="carousel-icon">{slide.icon}</div>
          </div>

          <div className="carousel-overlay">
            <div className="carousel-content">
              {/* inline image removed - using background image only */}
              <h1>{slide.title}</h1>
              <p>{slide.subtitle}</p>
              <button
                className="cta-button"
                onClick={() => scrollToSection(slide.buttonLink)}
              >
                {slide.buttonText}
              </button>
            </div>
          </div>
        </div>
      ))}
      <div className="carousel-nav">
        {SLIDES.map((_, index) => (
          <span 
            key={index}
            className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;