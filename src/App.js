import React, { useState, useEffect } from 'react';
import SearchPage from './components/SearchPage';
import PropertyModal from './components/PropertyModal';
import propertyData from './data/properties.json';
import './App.css';

function App() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Process the properties to add images array if not present
    const processedProperties = propertyData.properties.map(prop => ({
      ...prop,
      // If the property doesn't have an images array, create one with 6 images (using the same picture for all as fallback)
      images: prop.images || Array(6).fill(prop.picture)
    }));
    setProperties(processedProperties);
    setFilteredProperties(processedProperties);
  }, []);

  const addToFavourites = (property) => {
    if (!favourites.find(fav => fav.id === property.id)) {
      setFavourites([...favourites, property]);
    }
  };

  const removeFromFavourites = (propertyId) => {
    setFavourites(favourites.filter(fav => fav.id !== propertyId));
  };

  const clearFavourites = () => {
    setFavourites([]);
  };

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };

  const handleSearch = (filteredResults) => {
    setFilteredProperties(filteredResults);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🏠 Estate Agent Property Search</h1>
        <p>Find your dream property in London and surrounding areas</p>
      </header>
      
      <SearchPage 
        properties={filteredProperties}
        onSearch={handleSearch}
        favourites={favourites}
        addFav={addToFavourites}
        removeFav={removeFromFavourites}
        clearFav={clearFavourites}
        onPropertyClick={handlePropertyClick}
      />
      
      {isModalOpen && selectedProperty && (
        <PropertyModal 
          property={selectedProperty}
          onClose={closeModal}
          onAddToFavourite={() => addToFavourites(selectedProperty)}
          isInFavourites={favourites.some(fav => fav.id === selectedProperty.id)}
        />
      )}
    </div>
  );
}

export default App;