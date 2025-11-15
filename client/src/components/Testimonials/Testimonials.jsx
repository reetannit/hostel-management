import React from 'react';
import { TESTIMONIALS } from '../../data/constants';
import './Testimonials.css';

const Testimonials = () => {
  // Duplicate testimonials for seamless infinite scroll
  const duplicatedTestimonials = [...TESTIMONIALS, ...TESTIMONIALS];
  
  return (
    <section className="testimonials" id="testimonials">
      <div className="testimonials-container">
        <h2 className="section-title" style={{ color: 'white' }}>What Our Residents Say</h2>
        <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.9)' }}>
          Real experiences from our community
        </p>
        <div className="testimonial-grid">
          {duplicatedTestimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">{testimonial.avatar}</div>
                <div className="testimonial-info">
                  <h4>{testimonial.name}</h4>
                  <p className="testimonial-role">{testimonial.role}</p>
                </div>
              </div>
              <div className="stars">{'★'.repeat(testimonial.rating)}</div>
              <p className="testimonial-text">{testimonial.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;