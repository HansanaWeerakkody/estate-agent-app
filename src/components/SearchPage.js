import React, { useState } from 'react';
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

  const handleSearch = (searchFilters) => {
    setFilters(searchFilters);
    
    const filtered = properties.filter(prop => {
      // Type Match
      const typeMatch = searchFilters.type === 'any' || prop.type === searchFilters.type;

      // Price Match
      const propPrice = Number(prop.price);
      const minP = searchFilters.minPrice ? Number(searchFilters.minPrice) : 0;
      const maxP = searchFilters.maxPrice ? Number(searchFilters.maxPrice) : 99999999;
      const priceMatch = propPrice >= minP && propPrice <= maxP;

      // Bedrooms Match
      const propBed = Number(prop.bedrooms);
      const minB = searchFilters.minBedrooms ? Number(searchFilters.minBedrooms) : 0;
      const maxB = searchFilters.maxBedrooms ? Number(searchFilters.maxBedrooms) : 20;
      const bedMatch = propBed >= minB && propBed <= maxB;

      // Postcode Match
      const postcodeMatch = !searchFilters.postcode || 
        prop.location.toLowerCase().includes(searchFilters.postcode.toLowerCase());

      // Date Match
      let dateMatch = true;
      if (searchFilters.dateFrom) {
        const pDate = prop.added;
        const getMonthIndex = (monthStr) => {
          const months = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
          return months.indexOf(monthStr);
        };
        const propDateObj = new Date(pDate.year, getMonthIndex(pDate.month), pDate.day);
        dateMatch = propDateObj >= new Date(searchFilters.dateFrom);
      }

      return typeMatch && priceMatch && bedMatch && postcodeMatch && dateMatch;
    });

    onSearch(filtered);
  };

  return (
    <div className="page-container">
      {/* Search Bar */}
      <SearchForm onSearch={handleSearch} filters={filters} setFilters={setFilters} />
      
      <div className="content-area">
        {/* Results Grid */}
        <div className="main-results">
          <div className="results-header">
            <h2>Available Properties ({properties.length} found)</h2>
            <p>Click on any property card for detailed information</p>
          </div>
          
          <PropertyList 
            properties={properties}
            onPropertyClick={onPropertyClick}
            onAddToFavourites={addFav}
          />
        </div>

        {/* Favourites Sidebar */}
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