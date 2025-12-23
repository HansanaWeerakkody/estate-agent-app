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
    // Process properties to add additional images
    const processedProperties = propertyData.properties.map(prop => ({
      ...prop,
      dateAdded: new Date(`${prop.added.day} ${prop.added.month} ${prop.added.year}`),
      // Create array of 6-8 images for each property
      images: Array.from({length: 6}, (_, i) => 
        prop.picture.replace('small', `${i + 1}`).replace('.jpg', `${i + 1}.jpg`)
      )
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
        properties={properties}
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