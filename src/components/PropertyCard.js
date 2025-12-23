import React from 'react';
import { FaBed, FaHeart } from 'react-icons/fa';

const PropertyCard = ({ property, onPropertyClick, onAddToFavourites }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('propertyId', property.id);
  };

  return (
    <div 
      className="property-card"
      draggable
      onDragStart={handleDragStart}
      onClick={() => onPropertyClick(property)}
    >
      <div className="property-image-container">
        <img 
          src={property.picture} 
          alt={property.type}
          className="property-image"
        />
        <div className="property-overlay">
          <span className="property-price">£{property.price.toLocaleString()}</span>
          <button 
            className="favourite-button-card"
            onClick={(e) => {
              e.stopPropagation();
              onAddToFavourites(property);
            }}
          >
            <FaHeart /> Save
          </button>
        </div>
      </div>
      
      <div className="card-details">
        <h3>{property.type} in {property.location.split(',')[0]}</h3>
        
        <div className="property-features">
          <div className="feature">
            <FaBed />
            <span>{property.bedrooms} bed</span>
          </div>
          <div className="feature">
            <span>{property.tenure}</span>
          </div>
        </div>
        
        <p className="property-description">
          {property.description.replace(/<br>/g, ' ').substring(0, 100)}...
        </p>
        
        <div className="property-footer">
          <span className="property-location">{property.location.split(' ').pop()}</span>
          <span className="property-date">Added: {property.added.day} {property.added.month}</span>
        </div>
        
        <button 
          className="view-btn"
          onClick={(e) => {
            e.stopPropagation();
            onPropertyClick(property);
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;