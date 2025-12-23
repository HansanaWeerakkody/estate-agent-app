import React from 'react';
import PropertyCard from './PropertyCard';

const PropertyList = ({ properties, onPropertyClick, onAddToFavourites }) => {
  if (properties.length === 0) {
    return <div className="no-results">No properties found matching your criteria.</div>;
  }

  return (
    <div className="property-grid">
      {properties.map(property => (
        <PropertyCard 
          key={property.id}
          property={property}
          onPropertyClick={onPropertyClick}
          onAddToFavourites={onAddToFavourites}
        />
      ))}
    </div>
  );
};

export default PropertyList;