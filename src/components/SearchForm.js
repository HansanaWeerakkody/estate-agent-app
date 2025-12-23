import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const SearchForm = ({ onSearch, filters, setFilters }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value
    });
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit}>
        <select 
          value={filters.type} 
          onChange={e => handleChange('type', e.target.value)}
        >
          <option value="any">Any Type</option>
          <option value="House">House</option>
          <option value="Flat">Flat</option>
        </select>

        <input 
          type="number" 
          placeholder="Min Price" 
          value={filters.minPrice}
          onChange={e => handleChange('minPrice', e.target.value)}
        />
        
        <input 
          type="number" 
          placeholder="Max Price" 
          value={filters.maxPrice}
          onChange={e => handleChange('maxPrice', e.target.value)}
        />
        
        <input 
          type="number" 
          placeholder="Min Beds" 
          style={{width: '80px'}}
          value={filters.minBedrooms}
          onChange={e => handleChange('minBedrooms', e.target.value)}
        />
        
        <input 
          type="number" 
          placeholder="Max Beds" 
          style={{width: '80px'}}
          value={filters.maxBedrooms}
          onChange={e => handleChange('maxBedrooms', e.target.value)}
        />
        
        <input 
          type="text" 
          placeholder="Postcode (e.g. BR5)" 
          value={filters.postcode}
          onChange={e => handleChange('postcode', e.target.value)}
        />
        
        <DatePicker 
          selected={filters.dateFrom} 
          onChange={date => handleChange('dateFrom', date)} 
          placeholderText="Added After"
          dateFormat="dd/MM/yyyy"
        />
        
        <button type="submit" className="search-btn">Search</button>
        <button 
          type="button" 
          className="clear-btn"
          onClick={() => {
            setFilters({
              type: 'any',
              minPrice: '',
              maxPrice: '',
              minBedrooms: '',
              maxBedrooms: '',
              postcode: '',
              dateFrom: null,
              dateTo: null
            });
            onSearch({
              type: 'any',
              minPrice: '',
              maxPrice: '',
              minBedrooms: '',
              maxBedrooms: '',
              postcode: '',
              dateFrom: null,
              dateTo: null
            });
          }}
        >
          Clear
        </button>
      </form>
    </div>
  );
};

export default SearchForm;