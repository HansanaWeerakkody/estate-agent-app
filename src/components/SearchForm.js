import React from 'react';
import { DropdownList, NumberPicker } from 'react-widgets';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import 'react-widgets/styles.css';

const SearchForm = ({ onSearch, filters, setFilters }) => {
  const propertyTypes = ['any', 'House', 'Flat'];
  
  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-GB');
  };

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

  // Security: Sanitize input
  const sanitizeInput = (input) => {
    return input.replace(/[<>]/g, '');
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit}>
        {/* Property Type - Using React Widgets DropdownList */}
        <div className="form-group">
          <label htmlFor="property-type">Property Type:</label>
          <DropdownList
            id="property-type"
            data={propertyTypes}
            value={filters.type}
            onChange={value => handleChange('type', value)}
            placeholder="Select type..."
            className="react-widget"
          />
        </div>

        {/* Price Range - Using React Widgets NumberPicker */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="min-price">Min Price:</label>
            <NumberPicker
              id="min-price"
              min={0}
              value={filters.minPrice || 0}
              onChange={value => handleChange('minPrice', value)}
              placeholder="Min price"
              className="react-widget"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="max-price">Max Price:</label>
            <NumberPicker
              id="max-price"
              min={0}
              value={filters.maxPrice || ''}
              onChange={value => handleChange('maxPrice', value)}
              placeholder="Max price"
              className="react-widget"
            />
          </div>
        </div>

        {/* Bedrooms Range - Using React Widgets NumberPicker */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="min-bedrooms">Min Bedrooms:</label>
            <NumberPicker
              id="min-bedrooms"
              min={1}
              max={10}
              value={filters.minBedrooms || 1}
              onChange={value => handleChange('minBedrooms', value)}
              placeholder="Min"
              className="react-widget"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="max-bedrooms">Max Bedrooms:</label>
            <NumberPicker
              id="max-bedrooms"
              min={1}
              max={10}
              value={filters.maxBedrooms || ''}
              onChange={value => handleChange('maxBedrooms', value)}
              placeholder="Max"
              className="react-widget"
            />
          </div>
        </div>

        {/* Postcode - Secured Input */}
        <div className="form-group">
          <label htmlFor="postcode">Postcode Area:</label>
          <input
            id="postcode"
            type="text"
            placeholder="e.g. BR5, NW1"
            value={filters.postcode}
            onChange={e => handleChange('postcode', sanitizeInput(e.target.value))}
            maxLength="4"
            pattern="[A-Za-z0-9]{2,4}"
            title="Enter postcode area (e.g., BR5, NW1)"
          />
        </div>

        {/* Date Added - React DatePicker */}
        <div className="form-group">
          <label htmlFor="date-added">Added After:</label>
          <DatePicker
            id="date-added"
            selected={filters.dateFrom}
            onChange={date => handleChange('dateFrom', date)}
            placeholderText="Select date..."
            dateFormat="dd/MM/yyyy"
            showYearDropdown
            yearDropdownItemNumber={10}
            scrollableYearDropdown
            className="date-picker"
          />
          {filters.dateFrom && (
            <span className="date-display">{formatDate(filters.dateFrom)}</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button type="submit" className="search-btn">
            🔍 Search Properties
          </button>
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
                dateFrom: null
              });
              onSearch({
                type: 'any',
                minPrice: '',
                maxPrice: '',
                minBedrooms: '',
                maxBedrooms: '',
                postcode: '',
                dateFrom: null
              });
            }}
          >
            🗑️ Clear All
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;