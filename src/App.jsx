import React, { useState, useEffect } from 'react';
import SearchPage from './Components/SearchPage';
import PropertyModal from './Components/PropertyModal';
import propertyData from './data/properties.json';
import './App.css';

function App() {
  const [properties, setProperties] = useState([]);
  const [favourites, setFavourites] = useState(() => {
    // Load favourites from localStorage on initial render
    const savedFavourites = localStorage.getItem('propertyFavourites');
    return savedFavourites ? JSON.parse(savedFavourites) : [];
  });
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Process the properties to add images array if not present
    const processedProperties = propertyData.properties.map(prop => ({
      ...prop,
      // If the property doesn't have an images array, create one with 6 images
      images: prop.images || Array.from({length: 6}, (_, i) => 
        prop.picture.replace('small', '').replace('.jpg', '') + `pic${i + 1}.jpg`
      )
    }));
    setProperties(processedProperties);
  }, []);

  // Save favourites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('propertyFavourites', JSON.stringify(favourites));
  }, [favourites]);

  const addToFavourites = (property) => {
    if (!favourites.find(fav => fav.id === property.id)) {
      setFavourites([...favourites, property]);
      return true; // Successfully added
    }
    return false; // Already in favourites
  };

  const removeFromFavourites = (propertyId) => {
    setFavourites(favourites.filter(fav => fav.id !== propertyId));
  };

  const clearFavourites = () => {
    setFavourites([]);
  };

  // Function to check if a property is in favourites
  const isInFavourites = (propertyId) => {
    return favourites.some(fav => fav.id === propertyId);
  };

  // Handle drag and drop add from anywhere in the app
  const handleDropAdd = (e) => {
    e.preventDefault();
    const propertyData = e.dataTransfer.getData('application/json');
    if (propertyData) {
      try {
        const property = JSON.parse(propertyData);
        addToFavourites(property);
      } catch (error) {
        console.error('Error parsing dragged property data:', error);
      }
    }
  };

  // Handle drag over for the entire app
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
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
    // This callback can be used if parent needs to know about search results
    // For example, for analytics or other tracking
    console.log('Search results:', filteredResults.length, 'properties found');
  };

  return (
    <div 
      className="App"
      onDragOver={handleDragOver}
      onDrop={handleDropAdd}
    >
      <header className="app-header">
        <h1>🏠 Estate Agent Property Search</h1>
        <p>Find your dream property in London and surrounding areas</p>
        <div className="favourites-badge">
          <span className="heart-icon">❤️</span>
          <span className="favourites-count">{favourites.length}</span>
          <span>Favourites</span>
        </div>
      </header>
      
      <SearchPage 
        properties={properties}  // ← PASS THE COMPLETE, UNFILTERED LIST
        onSearch={handleSearch}
        favourites={favourites}
        addFav={addToFavourites}
        removeFav={removeFromFavourites}
        clearFav={clearFavourites}
        onPropertyClick={handlePropertyClick}
        isInFavourites={isInFavourites}
      />
      
      {isModalOpen && selectedProperty && (
        <PropertyModal 
          property={selectedProperty}
          onClose={closeModal}
          onAddToFavourite={() => addToFavourites(selectedProperty)}
          isInFavourites={isInFavourites(selectedProperty.id)}
        />
      )}
      
      {/* Simple Footer Added Here */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Estate Agent Property Search. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;