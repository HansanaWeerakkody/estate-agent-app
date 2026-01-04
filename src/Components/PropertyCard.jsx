import React from 'react';
import { FaBed, FaHeart } from 'react-icons/fa';

const PropertyCard = ({ property, onPropertyClick, onAddToFavourites, isInFavourites }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', property.id);
    e.dataTransfer.setData('application/json', JSON.stringify(property));
    e.dataTransfer.effectAllowed = 'copy';
    e.currentTarget.classList.add('dragging');
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
  };

  // Format the date to show day, month, and year
  const formatDate = () => {
    const { day, month, year } = property.added;
    return `${day} ${month} ${year}`;
  };

  return (
    <div 
      className={`property-card ${isInFavourites ? 'saved' : ''}`}
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {isInFavourites && (
        <div className="fav-indicator" title="In favourites">
          ❤️
        </div>
      )}
      <div className="property-image-container">
        <img 
          src={property.picture} 
          alt={property.type}
          className="property-image"
        />
        <div className="property-overlay">
          <span className="property-price">£{property.price.toLocaleString()}</span>
          <button 
            className={`favourite-button-card ${isInFavourites ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onAddToFavourites(property);
            }}
            title={isInFavourites ? 'Remove from favourites' : 'Add to favourites'}
          >
            <FaHeart /> {isInFavourites ? 'Saved' : 'Save'}
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
          <span className="property-date">Added: {formatDate()}</span>
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