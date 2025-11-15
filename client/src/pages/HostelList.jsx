import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, Home, ArrowRight, X } from 'lucide-react';
import './HostelList.css';

// Boys Hostels Data
const boysHostels = [
  {
    id: 1,
    name: 'Aryabhatta Hostel',
    capacity: 200,
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop',
    description: 'Modern facilities with spacious rooms',
    floors: 4,
    amenities: ['WiFi', 'Gym', 'Mess', 'Study Room']
  },
  {
    id: 2,
    name: 'Ramanujam Hostel',
    capacity: 180,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    description: 'Premium accommodation with AC rooms',
    floors: 3,
    amenities: ['WiFi', 'AC Rooms', 'Mess', 'Recreation Room']
  },
  {
    id: 3,
    name: 'Bhabha Hostel',
    capacity: 150,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    description: 'Eco-friendly hostel with green spaces',
    floors: 3,
    amenities: ['WiFi', 'Garden', 'Mess', 'Sports Area']
  },
  {
    id: 4,
    name: 'Vikram Sarabhai Hostel',
    capacity: 220,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    description: 'State-of-the-art infrastructure',
    floors: 5,
    amenities: ['WiFi', 'Gym', 'Mess', 'Library']
  }
];

// Girls Hostels Data
const girlsHostels = [
  {
    id: 5,
    name: 'Sarojini Naidu Hostel',
    capacity: 150,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
    description: 'Safe and secure environment with modern amenities',
    floors: 3,
    amenities: ['WiFi', 'Security', 'Mess', 'Reading Room']
  },
  {
    id: 6,
    name: 'Kalpana Chawla Hostel',
    capacity: 180,
    image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop',
    description: 'Premium accommodation with attached washrooms',
    floors: 4,
    amenities: ['WiFi', 'AC Rooms', 'Mess', 'Gym']
  },
  {
    id: 7,
    name: 'Indira Gandhi Hostel',
    capacity: 160,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
    description: 'Comfortable living with excellent facilities',
    floors: 3,
    amenities: ['WiFi', 'Security', 'Mess', 'Recreation Area']
  },
  {
    id: 8,
    name: 'Rani Laxmi Bai Hostel',
    capacity: 200,
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
    description: 'Spacious rooms with beautiful campus view',
    floors: 4,
    amenities: ['WiFi', 'Security', 'Mess', 'Study Room']
  }
];

const HostelList = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedHostel, setSelectedHostel] = useState(null);

  const openCategory = (category) => {
    setSelectedCategory(category);
  };

  const closeCategory = () => {
    setSelectedCategory(null);
    setSelectedHostel(null);
  };

  const viewHostelDetails = (hostel) => {
    setSelectedHostel(hostel);
  };

  const closeHostelDetails = () => {
    setSelectedHostel(null);
  };

  const handleApply = () => {
    navigate('/login');
  };

  const currentHostels = selectedCategory === 'boys' ? boysHostels : girlsHostels;

  return (
    <div className="hostel-list-page">
      {/* Header */}
      <div className="hostel-header">
        <h1>Our Hostels</h1>
        <p>Discover comfortable and modern living spaces</p>
      </div>

      {/* Category Selection Cards */}
      {!selectedCategory && (
        <div className="category-container">
          <div 
            className="category-card boys-card" 
            onClick={() => openCategory('boys')}
            style={{
              backgroundImage: `linear-gradient(rgba(79, 172, 254, 0.85), rgba(0, 242, 254, 0.85)), url('${boysHostels[0].image}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="category-icon">
              <Building2 size={60} />
            </div>
            <h2>Boys Hostels</h2>
            <p>{boysHostels.length} Hostels Available</p>
            <button className="view-btn">
              View Hostels <ArrowRight size={20} />
            </button>
          </div>

          <div 
            className="category-card girls-card" 
            onClick={() => openCategory('girls')}
            style={{
              backgroundImage: `linear-gradient(rgba(240, 147, 251, 0.85), rgba(245, 87, 108, 0.85)), url('${girlsHostels[0].image}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="category-icon">
              <Home size={60} />
            </div>
            <h2>Girls Hostels</h2>
            <p>{girlsHostels.length} Hostels Available</p>
            <button className="view-btn">
              View Hostels <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Hostel List View */}
      {selectedCategory && !selectedHostel && (
        <div className="hostel-grid-container">
          <div className="back-button-container">
            <button className="back-btn" onClick={closeCategory}>
              ← Back to Categories
            </button>
            <h2 className="category-title">
              {selectedCategory === 'boys' ? 'Boys Hostels' : 'Girls Hostels'}
            </h2>
          </div>

          <div className="hostel-grid">
            {currentHostels.map((hostel) => (
              <div key={hostel.id} className="hostel-card" onClick={() => viewHostelDetails(hostel)}>
                <div className="hostel-image">
                  <img src={hostel.image} alt={hostel.name} />
                  <div className="hostel-overlay">
                    <button className="view-details-btn">View Details</button>
                  </div>
                </div>
                <div className="hostel-info">
                  <h3>{hostel.name}</h3>
                  <p className="hostel-description">{hostel.description}</p>
                  <div className="hostel-stats">
                    <span>
                      <Users size={16} /> {hostel.capacity} Capacity
                    </span>
                    <span>
                      <Building2 size={16} /> {hostel.floors} Floors
                    </span>
                  </div>
                  <div className="hostel-amenities">
                    {hostel.amenities.slice(0, 3).map((amenity, index) => (
                      <span key={index} className="amenity-tag">{amenity}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hostel Details Modal */}
      {selectedHostel && (
        <div className="hostel-modal-overlay" onClick={closeHostelDetails}>
          <div className="hostel-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={closeHostelDetails}>
              <X size={24} />
            </button>
            <div className="modal-image">
              <img src={selectedHostel.image} alt={selectedHostel.name} />
            </div>
            <div className="modal-content">
              <h2>{selectedHostel.name}</h2>
              <p className="modal-description">{selectedHostel.description}</p>
              <div className="modal-stats">
                <div className="stat-item">
                  <Users size={24} />
                  <span>{selectedHostel.capacity} Students</span>
                </div>
                <div className="stat-item">
                  <Building2 size={24} />
                  <span>{selectedHostel.floors} Floors</span>
                </div>
              </div>
              <div className="modal-amenities">
                <h3>Amenities</h3>
                <div className="amenities-grid">
                  {selectedHostel.amenities.map((amenity, index) => (
                    <span key={index} className="amenity-badge">{amenity}</span>
                  ))}
                </div>
              </div>
              <button className="apply-btn" onClick={handleApply}>Apply for This Hostel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostelList;
