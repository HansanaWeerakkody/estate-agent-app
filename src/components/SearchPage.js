import React, { useState, useEffect, useCallback } from 'react';
import PropertyList from './PropertyList';
import FavouritesList from './FavouritesList';
import SearchForm from './SearchForm';

const SearchPage = ({ properties, onSearch, favourites, addFav, removeFav, clearFav, onPropertyClick }) => {
  const [filters, setFilters] = useState({
    type: 'any',
    minPrice: '',
    maxPrice: '',
    minBedrooms: '',
    maxBedrooms: '',
    postcode: '',
    dateFrom: null,
    dateTo: null
  });

  const [filteredProperties, setFilteredProperties] = useState([]);

  // Initialize with all properties
  useEffect(() => {
    setFilteredProperties(properties);
  }, [properties]);

  // Helper function to convert month string to index
  const getMonthIndex = useCallback((monthStr) => {
    const months = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    return months.indexOf(monthStr);
  }, []);

  // Filter properties function
  const filterProperties = useCallback((searchFilters, propertiesList) => {
    if (!propertiesList || propertiesList.length === 0) return [];

    return propertiesList.filter(prop => {
      // Type Match
      if (searchFilters.type !== 'any' && prop.type !== searchFilters.type) {
        return false;
      }

      // Price Match
      const propPrice = Number(prop.price);
      const minP = searchFilters.minPrice ? Number(searchFilters.minPrice) : 0;
      const maxP = searchFilters.maxPrice ? Number(searchFilters.maxPrice) : 999999999;
      
      if (propPrice < minP) return false;
      if (searchFilters.maxPrice && propPrice > maxP) return false;

      // Bedrooms Match
      const propBed = Number(prop.bedrooms);
      const minB = searchFilters.minBedrooms ? Number(searchFilters.minBedrooms) : 0;
      const maxB = searchFilters.maxBedrooms ? Number(searchFilters.maxBedrooms) : 100;
      
      if (propBed < minB) return false;
      if (searchFilters.maxBedrooms && propBed > maxB) return false;

      // Postcode Match
      if (searchFilters.postcode && searchFilters.postcode.trim() !== '') {
        const postcodeUpper = searchFilters.postcode.toUpperCase().trim();
        const locationUpper = prop.location.toUpperCase();
        if (!locationUpper.includes(postcodeUpper)) {
          return false;
        }
      }

      // Date Match
      if (searchFilters.dateFrom) {
        const pDate = prop.added;
        const propDateObj = new Date(pDate.year, getMonthIndex(pDate.month), pDate.day);
        const filterDate = new Date(searchFilters.dateFrom);
        
        if (propDateObj < filterDate) {
          return false;
        }
      }

      return true;
    });
  }, [getMonthIndex]);

  // Handle search when filters change
  const handleSearch = useCallback((searchFilters) => {
    setFilters(searchFilters);
    
    const filtered = filterProperties(searchFilters, properties);
    setFilteredProperties(filtered);
    
    // Notify parent component about search results
    if (onSearch) {
      onSearch(filtered);
    }
  }, [properties, filterProperties, onSearch]);

  // Clear all filters function
  const handleClearAll = useCallback(() => {
    const initialFilters = {
      type: 'any',
      minPrice: '',
      maxPrice: '',
      minBedrooms: '',
      maxBedrooms: '',
      postcode: '',
      dateFrom: null
    };
    
    setFilters(initialFilters);
    setFilteredProperties(properties);
    
    if (onSearch) {
      onSearch(properties);
    }
  }, [properties, onSearch]);

  // Add clear button handler to window for global access
  useEffect(() => {
    const handleGlobalClear = (e) => {
      if (e.detail && e.detail.action === 'clearAll') {
        handleClearAll();
      }
    };
    
    window.addEventListener('clearFilters', handleGlobalClear);
    
    return () => {
      window.removeEventListener('clearFilters', handleGlobalClear);
    };
  }, [handleClearAll]);

  return (
    <div className="page-container">
      <SearchForm 
        onSearch={handleSearch} 
        filters={filters} 
        setFilters={setFilters}
      />
      
      <div className="content-area">
        <div className="main-results">
          <div className="results-header">
            <h2>Available Properties ({filteredProperties.length} found)</h2>
            <p>Click on any property card for detailed information</p>
            <div className="search-info">
              {filters.type !== 'any' && (
                <span className="filter-tag">Type: {filters.type}</span>
              )}
              {filters.minPrice && (
                <span className="filter-tag">Min Price: £{parseInt(filters.minPrice).toLocaleString()}</span>
              )}
              {filters.maxPrice && (
                <span className="filter-tag">Max Price: £{parseInt(filters.maxPrice).toLocaleString()}</span>
              )}
              {filters.minBedrooms && (
                <span className="filter-tag">Min Beds: {filters.minBedrooms}</span>
              )}
              {filters.maxBedrooms && (
                <span className="filter-tag">Max Beds: {filters.maxBedrooms}</span>
              )}
              {filters.postcode && (
                <span className="filter-tag">Postcode: {filters.postcode}</span>
              )}
              {filters.dateFrom && (
                <span className="filter-tag">
                  Added After: {new Date(filters.dateFrom).toLocaleDateString('en-GB')}
                </span>
              )}
              {Object.values(filters).some(val => 
                val !== 'any' && val !== '' && val !== null && val !== undefined
              ) && (
                <button 
                  onClick={handleClearAll}
                  className="clear-results-btn"
                >
                  Clear Search Results
                </button>
              )}
            </div>
          </div>
          
          <PropertyList 
            properties={filteredProperties}
            onPropertyClick={onPropertyClick}
            onAddToFavourites={addFav}
          />
        </div>

        <FavouritesList 
          favourites={favourites}
          onRemove={removeFav}
          onClear={clearFav}
        />
      </div>
    </div>
  );
};

export default SearchPage;