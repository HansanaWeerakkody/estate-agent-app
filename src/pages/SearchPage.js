import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import data from '../data/properties.json'; // Importing your JSON

const SearchPage = ({ favourites, addFav, removeFav, clearFav }) => {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({
    type: 'any',
    minPrice: '',
    maxPrice: '',
    minBedrooms: '',
    maxBedrooms: '',
    postcode: '',
    dateAfter: null
  });

  // Load data on mount
  useEffect(() => {
    setProperties(data.properties);
  }, []);

  // Helper: Convert JSON "Month String" to JS Month Index
  const getMonthIndex = (monthStr) => {
    const months = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    return months.indexOf(monthStr);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    const filtered = data.properties.filter(prop => {
      // 1. Type Match
      const typeMatch = filters.type === 'any' || prop.type === filters.type;

      // 2. Price Match
      const propPrice = Number(prop.price);
      const minP = filters.minPrice ? Number(filters.minPrice) : 0;
      const maxP = filters.maxPrice ? Number(filters.maxPrice) : 99999999;
      const priceMatch = propPrice >= minP && propPrice <= maxP;

      // 3. Bedrooms Match
      const propBed = Number(prop.bedrooms);
      const minB = filters.minBedrooms ? Number(filters.minBedrooms) : 0;
      const maxB = filters.maxBedrooms ? Number(filters.maxBedrooms) : 20;
      const bedMatch = propBed >= minB && propBed <= maxB;

      // 4. Postcode Match (Searching inside 'location' string)
      const postcodeMatch = prop.location.toLowerCase().includes(filters.postcode.toLowerCase());

      // 5. Date Match
      let dateMatch = true;
      if (filters.dateAfter) {
        const pDate = prop.added;
        // Create JS Date from JSON data
        const propDateObj = new Date(pDate.year, getMonthIndex(pDate.month), pDate.day);
        dateMatch = propDateObj >= filters.dateAfter;
      }

      return typeMatch && priceMatch && bedMatch && postcodeMatch && dateMatch;
    });

    setProperties(filtered);
  };

  // --- Drag and Drop Handlers ---
  const handleDragStart = (e, property) => {
    e.dataTransfer.setData("propertyId", property.id);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("propertyId");
    const property = data.properties.find(p => p.id === id);
    if (property) addFav(property);
  };

  const allowDrop = (e) => e.preventDefault();

  return (
    <div className="page-container">
      {/* Search Bar */}
      <div className="search-bar">
        <form onSubmit={handleSearch}>
          <select onChange={e => setFilters({...filters, type: e.target.value})}>
            <option value="any">Any Type</option>
            <option value="House">House</option>
            <option value="Flat">Flat</option>
          </select>
          <input type="number" placeholder="Min Price" onChange={e => setFilters({...filters, minPrice: e.target.value})} />
          <input type="number" placeholder="Max Price" onChange={e => setFilters({...filters, maxPrice: e.target.value})} />
          <input type="number" placeholder="Min Beds" onChange={e => setFilters({...filters, minBedrooms: e.target.value})} style={{width: '80px'}}/>
          <input type="number" placeholder="Max Beds" onChange={e => setFilters({...filters, maxBedrooms: e.target.value})} style={{width: '80px'}}/>
          <input type="text" placeholder="Postcode (e.g. BR5)" onChange={e => setFilters({...filters, postcode: e.target.value})} />
          <DatePicker 
            selected={filters.dateAfter} 
            onChange={date => setFilters({...filters, dateAfter: date})} 
            placeholderText="Added After Date"
          />
          <button type="submit" className="search-btn">Search</button>
        </form>
      </div>

      <div className="content-area">
        {/* Results Grid */}
        <div className="property-grid">
          {properties.length === 0 ? <p>No properties found.</p> : properties.map(prop => (
            <div 
              key={prop.id} 
              className="property-card"
              draggable
              onDragStart={(e) => handleDragStart(e, prop)}
            >
              <img src={`/${prop.picture}`} alt={prop.type} />
              <div className="card-details">
                <h3>{prop.location}</h3>
                <p className="price">£{prop.price.toLocaleString()}</p>
                <p>{prop.type} | {prop.bedrooms} Beds</p>
                <p>{prop.description.substring(0, 80)}...</p>
                <div className="card-actions">
                  <button onClick={() => addFav(prop)}>❤ Save</button>
                  <Link to={`/property/${prop.id}`} className="view-btn">View Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Favourites Drop Zone */}
        <div 
          className="favourites-zone"
          onDrop={handleDrop}
          onDragOver={allowDrop}
        >
          <h3>Favourites (Drag Here)</h3>
          {favourites.length === 0 && <p className="empty-msg">Drag properties here to save them.</p>}
          
          <ul className="fav-list">
            {favourites.map(fav => (
              <li key={fav.id}>
                <span>{fav.location}</span>
                <button onClick={() => removeFav(fav.id)} className="remove-btn">x</button>
              </li>
            ))}
          </ul>
          {favourites.length > 0 && <button onClick={clearFav} className="clear-btn">Clear All</button>}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;