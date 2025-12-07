import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import PropertyPage from './pages/PropertyPage';
import './App.css';

function App() {
  // Global State for Favourites (Lifted State)
  const [favourites, setFavourites] = useState([]);

  // Function to add item (prevents duplicates)
  const addToFavourites = (property) => {
    if (!favourites.some(fav => fav.id === property.id)) {
      setFavourites([...favourites, property]);
    } else {
      alert("Property already in favourites!");
    }
  };

  // Function to remove item
  const removeFromFavourites = (id) => {
    setFavourites(favourites.filter(prop => prop.id !== id));
  };

  // Function to clear all
  const clearFavourites = () => {
    setFavourites([]);
  };

  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <h1>Estate Agent App</h1>
        </header>
        <Routes>
          <Route 
            path="/" 
            element={
              <SearchPage 
                favourites={favourites} 
                addFav={addToFavourites} 
                removeFav={removeFromFavourites} 
                clearFav={clearFavourites}
              />
            } 
          />
          <Route 
            path="/property/:id" 
            element={<PropertyPage addFav={addToFavourites} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;