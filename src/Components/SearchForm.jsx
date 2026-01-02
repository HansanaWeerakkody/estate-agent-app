import React, { useRef } from 'react';
import { Combobox, NumberPicker } from 'react-widgets'; // Changed from DropdownList to Combobox
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import 'react-widgets/styles.css';

const SearchForm = ({ onSearch, filters, setFilters, onClear }) => {
  const propertyTypes = ['Any', 'House', 'Flat'];
  const formRef = useRef(null);

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

  const sanitizeInput = (input) => {
    return input ? input.replace(/[<>]/g, '') : '';
  };

  const handleClearAll = (e) => {
    e?.preventDefault();
    
    const initialFilters = {
      type: 'Any',
      minPrice: '',
      maxPrice: '',
      minBedrooms: '',
      maxBedrooms: '',
      postcode: '',
      dateFrom: null
    };

    setFilters(initialFilters);
    
    // Call the onClear prop to notify parent to reset search results
    if (onClear) {
      onClear();
    }
    
    // Prevent any accidental form submission
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  // Prevent form submission when pressing Enter in input fields
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.type !== 'submit') {
      e.preventDefault();
    }
  };

  return (
    <div className="search-bar">
      <form 
        ref={formRef}
        onSubmit={handleSubmit} 
        id="search-form"
        onKeyDown={handleKeyDown}
        role="search"
        aria-label="Property search form"
      >
        {/* ================= ROW 1 – MAIN FILTERS ================= */}
        <div className="form-row">
          {/* Property Type - CHANGED TO COMBOBOX */}
          <div className="form-group">
            <label htmlFor="property-type" className="form-label">
              Property Type
            </label>
            <Combobox
              id="property-type"
              data={propertyTypes}
              value={filters.type}
              onChange={value => handleChange('type', value)}
              placeholder="Select type or type h/house or f/flat..."
              className="react-widget"
              aria-label="Select or type property type"
              filter="contains"
              hideEmptyPopup
              textField={(item) => typeof item === 'string' ? item : ''}
              // This ensures the value is properly displayed
              onBlur={(e) => {
                // If the typed value doesn't match any option, keep it as is
                const typedValue = e.target.value;
                if (typedValue && !propertyTypes.includes(typedValue)) {
                  // You could either keep the typed value or reset to current filter
                  // For now, we'll keep whatever was typed
                  handleChange('type', typedValue);
                }
              }}
            />
          </div>

          {/* Min Price */}
          <div className="form-group">
            <label htmlFor="min-price" className="form-label">
              Min Price
            </label>
            <NumberPicker
              id="min-price"
              min={0}
              value={filters.minPrice || ''}
              onChange={value => handleChange('minPrice', value)}
              placeholder="Min"
              className="react-widget"
              aria-label="Minimum price"
            />
          </div>

          {/* Max Price */}
          <div className="form-group">
            <label htmlFor="max-price" className="form-label">
              Max Price
            </label>
            <NumberPicker
              id="max-price"
              min={0}
              value={filters.maxPrice || ''}
              onChange={value => handleChange('maxPrice', value)}
              placeholder="Max"
              className="react-widget"
              aria-label="Maximum price"
            />
          </div>

          {/* Postcode */}
          <div className="form-group">
            <label htmlFor="postcode" className="form-label">
              Postcode Area
            </label>
            <input
              id="postcode"
              type="text"
              placeholder="e.g. BR5, NW1"
              value={filters.postcode || ''}
              onChange={e => handleChange('postcode', sanitizeInput(e.target.value.toUpperCase()))}
              onBlur={e => {
                const value = e.target.value.toUpperCase().trim();
                handleChange('postcode', value);
              }}
              maxLength="4"
              pattern="[A-Za-z0-9]{2,4}"
              className="postcode-input"
              aria-label="Postcode area"
              title="Enter 2-4 character postcode area (e.g., BR5, NW1)"
            />
          </div>
        </div>

        {/* ================= ROW 2 – SECONDARY FILTERS + ACTIONS ================= */}
        <div className="form-actions">
          {/* Min Bedrooms */}
          <div className="form-group">
            <label htmlFor="min-bedrooms" className="form-label">
              Min Beds
            </label>
            <NumberPicker
              id="min-bedrooms"
              min={1}
              max={10}
              value={filters.minBedrooms || ''}
              onChange={value => handleChange('minBedrooms', value)}
              placeholder="Min"
              className="react-widget"
              aria-label="Minimum bedrooms"
            />
          </div>

          {/* Max Bedrooms */}
          <div className="form-group">
            <label htmlFor="max-bedrooms" className="form-label">
              Max Beds
            </label>
            <NumberPicker
              id="max-bedrooms"
              min={1}
              max={10}
              value={filters.maxBedrooms || ''}
              onChange={value => handleChange('maxBedrooms', value)}
              placeholder="Max"
              className="react-widget"
              aria-label="Maximum bedrooms"
            />
          </div>

          {/* Date */}
          <div className="form-group">
            <label htmlFor="date-added" className="form-label">
              Added After Date
            </label>
            <DatePicker
              id="date-added"
              selected={filters.dateFrom}
              onChange={date => handleChange('dateFrom', date)}
              placeholderText="Select date"
              dateFormat="dd/MM/yyyy"
              isClearable
              className="react-datepicker-wrapper"
              aria-label="Date added on"
              showYearDropdown
              yearDropdownItemNumber={10}
              scrollableYearDropdown
            />
          </div>

          {/* Spacer - keeps buttons aligned to the right */}
          <div className="form-spacer"></div>

          {/* Search Button */}
          <button 
            type="submit" 
            className="search-btn"
            aria-label="Search properties"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
            Search
          </button>

          {/* Clear Button */}
          <button
            type="button"
            className="clear-btn"
            onClick={handleClearAll}
            aria-label="Clear all filters"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
              <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg>
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;