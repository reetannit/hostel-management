import React from 'react';
import { FEATURES } from '../../data/constants';
import './features.css';

const Features = () => {
  return (
    <section className="features" id="features">
      <h2 className="section-title">Our Features</h2>
      <p className="section-subtitle">Everything you need for a comfortable stay</p>
      <div className="features-grid">
        {FEATURES.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <div key={index} className="feature-card">
              <div className="feature-icon">
                <IconComponent size={48} strokeWidth={2} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Features;
