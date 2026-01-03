import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { FaTimes, FaBed, FaMapMarkerAlt, FaCalendar, FaHeart, FaRulerCombined, FaBath, FaCar, FaTree, FaUtensils, FaWifi, FaSnowflake, FaFire, FaTint, FaCouch, FaShieldAlt, FaSun, FaThermometerHalf } from 'react-icons/fa';
import DOMPurify from "dompurify";
import '../App.css';

const PropertyModal = ({ property, onClose, onAddToFavourite, isInFavourites }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Security: Sanitize HTML content
  const sanitizeHTML = (html) => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'b', 'i', 'em', 'strong'],
      ALLOWED_ATTR: []
    });
  };

  // Security: Escape special characters for display
  const escapeHTML = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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

  // Function to get property-specific key features based on property ID
  const getPropertyKeyFeatures = () => {
    // Create a map of property IDs to their unique features
    const propertyFeaturesMap = {
      1: [ // Property 1 features
        { icon: <FaBath />, text: "Luxury ensuite bathroom with heated floors" },
        { icon: <FaCar />, text: "Double garage with electric charging point" },
        { icon: <FaTree />, text: "Private landscaped garden with patio" },
        { icon: <FaUtensils />, text: "Modern open-plan kitchen with quartz countertops" },
        { icon: <FaWifi />, text: "Smart home system with high-speed fiber broadband" },
        { icon: <FaSnowflake />, text: "Energy-efficient underfloor heating throughout" }
      ],
      2: [ // Property 2 features
        { icon: <FaFire />, text: "Contemporary wood-burning stove" },
        { icon: <FaTint />, text: "Water softener and filtration system" },
        { icon: <FaCouch />, text: "Built-in entertainment center with surround sound" },
        { icon: <FaShieldAlt />, text: "24/7 security system with CCTV" },
        { icon: <FaSun />, text: "South-facing balcony with panoramic views" },
        { icon: <FaThermometerHalf />, text: "Dual-zone climate control" }
      ],
      3: [ // Property 3 features
        { icon: <FaBath />, text: "Spa-inspired bathroom with Jacuzzi tub" },
        { icon: <FaCar />, text: "Off-street parking for 3 vehicles" },
        { icon: <FaTree />, text: "Low-maintenance courtyard garden" },
        { icon: <FaUtensils />, text: "Chef's kitchen with professional appliances" },
        { icon: <FaWifi />, text: "Whole-house mesh Wi-Fi system" },
        { icon: <FaSnowflake />, text: "Newly installed energy-efficient HVAC" }
      ],
      4: [ // Property 4 features
        { icon: <FaFire />, text: "Traditional fireplace in living room" },
        { icon: <FaTint />, text: "Rainwater harvesting system" },
        { icon: <FaCouch />, text: "Walk-in wardrobe in master bedroom" },
        { icon: <FaShieldAlt />, text: "Keyless entry with biometric lock" },
        { icon: <FaSun />, text: "Roof terrace with city skyline views" },
        { icon: <FaThermometerHalf />, text: "Solar panels reducing energy costs" }
      ],
      5: [ // Property 5 features
        { icon: <FaBath />, text: "Wet room with premium finishes" },
        { icon: <FaCar />, text: "Secure underground parking space" },
        { icon: <FaTree />, text: "Communal gardens with children's play area" },
        { icon: <FaUtensils />, text: "Breakfast bar and wine cooler" },
        { icon: <FaWifi />, text: "Ethernet ports in every room" },
        { icon: <FaSnowflake />, text: "Triple-glazed windows throughout" }
      ],
      6: [ // Property 6 features
        { icon: <FaFire />, text: "Inglenook fireplace in dining room" },
        { icon: <FaTint />, text: "Hot water recirculation system" },
        { icon: <FaCouch />, text: "Home cinema with projector screen" },
        { icon: <FaShieldAlt />, text: "Gated community with concierge" },
        { icon: <FaSun />, text: "Sunroom with bi-fold doors" },
        { icon: <FaThermometerHalf />, text: "Air source heat pump" }
      ],
      7: [ // Property 7 features
        { icon: <FaBath />, text: "Jack and Jill bathroom" },
        { icon: <FaCar />, text: "Electric car charging station" },
        { icon: <FaTree />, text: "Mature orchard with fruit trees" },
        { icon: <FaUtensils />, text: "Butler's pantry and walk-in larder" },
        { icon: <FaWifi />, text: "5G-ready infrastructure" },
        { icon: <FaSnowflake />, text: "Passive house certified insulation" }
      ]
    };

    // Get property ID number (extracting number from "prop1", "prop2", etc.)
    const idNum = parseInt(property.id.replace('prop', '')) || 1;
    
    // If property ID is 1-7, return specific features, otherwise return default features
    if (propertyFeaturesMap[idNum]) {
      return propertyFeaturesMap[idNum];
    }

    // Default features for properties beyond 7 (if you add more later)
    return [
      { icon: <FaBath />, text: `${property.bedrooms} well-appointed bathrooms` },
      { icon: <FaCar />, text: "Convenient parking available" },
      { icon: <FaTree />, text: "Outdoor space" },
      { icon: <FaUtensils />, text: "Modern kitchen appliances" },
      { icon: <FaWifi />, text: "High-speed internet ready" },
      { icon: <FaSnowflake />, text: "Efficient heating system" }
    ];
  };

  // Use the images array from property data
  const imagePaths = property.images || [property.picture];
  const keyFeatures = getPropertyKeyFeatures();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {/* Security: Escape property type and location */}
            {escapeHTML(property.type)} in {escapeHTML(property.location.split(',')[0])}
          </h2>
          <button 
            className="close-button"
            onClick={onClose}
            aria-label="Close modal"
          >
            <FaTimes />
          </button>
        </div>

        <div className="modal-body">
          {/* Image Gallery Section */}
          <div className="gallery-section">
            <div className="main-image-container">
              <img 
                src={imagePaths[currentImageIndex]} 
                alt={`${property.type} view ${currentImageIndex + 1}`}
                className="main-image"
                loading="lazy"
                onError={(e) => {
                  // Fallback to the main picture if image fails to load
                  e.target.src = property.picture;
                }}
              />
              {imagePaths.length > 1 && (
                <>
                  <button 
                    className="nav-button prev" 
                    onClick={prevImage}
                    aria-label="Previous image"
                  >
                    &lt;
                  </button>
                  <button 
                    className="nav-button next" 
                    onClick={nextImage}
                    aria-label="Next image"
                  >
                    &gt;
                  </button>
                </>
              )}
            </div>
            
            {imagePaths.length > 1 && (
              <div className="thumbnail-container">
                {imagePaths.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                    loading="lazy"
                    onError={(e) => {
                      // Hide thumbnail or show placeholder if image doesn't exist
                      e.target.style.display = 'none';
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="property-details-section">
            <div className="quick-info">
              <div className="info-item price">
                <h3>£{property.price.toLocaleString()}</h3>
                <p>{escapeHTML(property.tenure)}</p>
              </div>
              
              <div className="info-features">
                <div className="feature">
                  <FaBed />
                  <span>{property.bedrooms} Bedroom{property.bedrooms !== 1 ? 's' : ''}</span>
                </div>
                <div className="feature">
                  <FaMapMarkerAlt />
                  <span>{escapeHTML(property.location)}</span>
                </div>
                <div className="feature">
                  <FaCalendar />
                  <span>Added: {property.added.day} {property.added.month} {property.added.year}</span>
                </div>
              </div>
            </div>

            {/* Tabs Navigation */}
            <Tabs selectedIndex={activeTab} onSelect={setActiveTab}>
              <TabList className="tabs-navigation">
                <Tab className="tab-button">Description</Tab>
                <Tab className="tab-button">Floor Plan</Tab>
                <Tab className="tab-button">Map</Tab>
              </TabList>

              <TabPanel>
                <div className="tab-content">
                  <h3>Property Description</h3>
                  {/* Security: Use sanitized HTML */}
                  <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(property.description) }} />
                  <div className="property-features">
                    <h4>Key Features:</h4>
                    <div className="key-features-grid">
                      {keyFeatures.map((feature, index) => (
                        <div key={index} className="key-feature-item">
                          <div className="key-feature-icon">
                            {feature.icon}
                          </div>
                          <span className="key-feature-text">{escapeHTML(feature.text)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabPanel>

              <TabPanel>
                <div className="tab-content">
                  <h3>Floor Plan</h3>
                  <div className="floor-plan">
                    <div className="placeholder-box">
                      {property.floorPlan && (
                        <img 
                          src={property.floorPlan} 
                          alt="Floor Plan" 
                          className="floor-plan-image"
                          loading="lazy"
                          onError={(e) => {
                            // Hide or show placeholder if floor plan fails to load
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML += '<p>Floor plan image not available</p>';
                          }}
                        />
                      )}
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
                      loading="lazy"
                    ></iframe>
                    <p className="map-note">
                      <FaMapMarkerAlt /> {escapeHTML(property.location)}
                    </p>
                  </div>
                </div>
              </TabPanel>
            </Tabs>

            {/* Action Buttons */}
            <div className="modal-actions">
              <button 
                className={`favourite-btn ${isInFavourites ? 'in-favourites' : ''}`}
                onClick={onAddToFavourite}
                aria-label={isInFavourites ? 'Remove from favourites' : 'Add to favourites'}
              >
                <FaHeart /> {isInFavourites ? 'In Favourites' : 'Add to Favourites'}
              </button>
              <button className="contact-btn">
                📞 Contact Agent
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