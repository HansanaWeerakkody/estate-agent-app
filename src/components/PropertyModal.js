import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { FaTimes, FaBed, FaMapMarkerAlt, FaCalendar, FaHeart, FaRulerCombined } from 'react-icons/fa';
import './Modal.css';

const PropertyModal = ({ property, onClose, onAddToFavourite, isInFavourites }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get month index for date conversion
  const getMonthIndex = (monthStr) => {
    const months = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    return months.indexOf(monthStr);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === property.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? property.images.length - 1 : prevIndex - 1
    );
  };

  const dateObj = new Date(
    property.added.year,
    getMonthIndex(property.added.month),
    property.added.day
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2>{property.type} in {property.location.split(',')[0]}</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Main Content */}
        <div className="modal-body">
          {/* Image Gallery Section */}
          <div className="gallery-section">
            <div className="main-image-container">
              <img 
                src={property.images[currentImageIndex] || property.picture} 
                alt={`${property.type} view ${currentImageIndex + 1}`}
                className="main-image"
              />
              <button className="nav-button prev" onClick={prevImage}>&lt;</button>
              <button className="nav-button next" onClick={nextImage}>&gt;</button>
            </div>
            
            <div className="thumbnail-container">
              {property.images.map((image, index) => (
                <img
                  key={index}
                  src={image || property.picture}
                  alt={`Thumbnail ${index + 1}`}
                  className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>

          {/* Property Details */}
          <div className="property-details-section">
            {/* Quick Info */}
            <div className="quick-info">
              <div className="info-item price">
                <h3>£{property.price.toLocaleString()}</h3>
                <p>{property.tenure}</p>
              </div>
              
              <div className="info-features">
                <div className="feature">
                  <FaBed />
                  <span>{property.bedrooms} Bedrooms</span>
                </div>
                <div className="feature">
                  <FaMapMarkerAlt />
                  <span>{property.location}</span>
                </div>
                <div className="feature">
                  <FaCalendar />
                  <span>Added: {property.added.day} {property.added.month} {property.added.year}</span>
                </div>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="tabs-container">
              <Tabs selectedIndex={activeTab} onSelect={setActiveTab}>
                <TabList className="tabs-navigation">
                  <Tab className="tab-button">Description</Tab>
                  <Tab className="tab-button">Floor Plan</Tab>
                  <Tab className="tab-button">Map</Tab>
                </TabList>

                <TabPanel>
                  <div className="tab-content">
                    <h3>Property Description</h3>
                    <p dangerouslySetInnerHTML={{ __html: property.description }} />
                    <div className="property-features">
                      <h4>Key Features:</h4>
                      <ul>
                        <li>{property.bedrooms} bedrooms</li>
                        <li>{property.tenure}</li>
                        <li>Located in {property.location}</li>
                        <li>Available from {property.added.month} {property.added.year}</li>
                      </ul>
                    </div>
                  </div>
                </TabPanel>

                <TabPanel>
                  <div className="tab-content">
                    <h3>Floor Plan</h3>
                    <div className="floor-plan">
                      <div className="placeholder-box">
                        <FaRulerCombined className="floor-plan-icon" />
                        <p>Floor Plan for {property.type} in {property.location.split(',')[0]}</p>
                        {/* You can add actual floor plan image here */}
                        <img 
                          src={property.picture} 
                          alt="Floor Plan" 
                          style={{filter: 'grayscale(100%)', width: '300px', marginTop: '15px'}}
                        />
                      </div>
                    </div>
                  </div>
                </TabPanel>

                <TabPanel>
                  <div className="tab-content">
                    <h3>Location Map</h3>
                    <div className="map-container">
                      <iframe
                        title="property-location"
                        width="100%"
                        height="300"
                        frameBorder="0"
                        scrolling="no"
                        marginHeight="0"
                        marginWidth="0"
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(property.location)}&z=15&output=embed`}
                      ></iframe>
                      <p className="map-note">
                        <FaMapMarkerAlt /> {property.location}
                      </p>
                    </div>
                  </div>
                </TabPanel>
              </Tabs>
            </div>

            {/* Action Buttons */}
            <div className="modal-actions">
              <button 
                className={`favourite-btn ${isInFavourites ? 'in-favourites' : ''}`}
                onClick={onAddToFavourite}
              >
                <FaHeart /> {isInFavourites ? 'In Favourites' : 'Add to Favourites'}
              </button>
              <button className="contact-btn">
                Contact Agent
              </button>
              <button className="close-btn" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyModal;