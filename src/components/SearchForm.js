import React, { useEffect } from 'react';
import { DropdownList, NumberPicker } from 'react-widgets';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import 'react-widgets/styles.css';

const SearchForm = ({ onSearch, filters, setFilters }) => {
  const propertyTypes = ['any', 'House', 'Flat'];

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

  const sanitizeInput = (input) => {
    return input ? input.replace(/[<>]/g, '') : '';
  };

  const handleClearAll = () => {
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
    onSearch(initialFilters);
  };

  useEffect(() => {
    const form = document.querySelector('.search-bar form');
    if (form) {
      form.dispatchEvent(new Event('submit', { cancelable: true }));
    }
  }, [filters]);

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit} id="search-form">

        {/* ================= ROW 1 – FILTERS ================= */}
        <div className="form-row">
          {/* Property Type */}
          <div className="form-group">
            <label htmlFor="property-type">Property Type</label>
            <DropdownList
              id="property-type"
              data={propertyTypes}
              value={filters.type}
              onChange={value => handleChange('type', value)}
              placeholder="Select type..."
              className="react-widget"
            />
          </div>

          {/* Min Price */}
          <div className="form-group">
            <label htmlFor="min-price">Min Price</label>
            <NumberPicker
              id="min-price"
              min={0}
              value={filters.minPrice || ''}
              onChange={value => handleChange('minPrice', value)}
              placeholder="Min"
              className="react-widget"
            />
          </div>

          {/* Max Price */}
          <div className="form-group">
            <label htmlFor="max-price">Max Price</label>
            <NumberPicker
              id="max-price"
              min={0}
              value={filters.maxPrice || ''}
              onChange={value => handleChange('maxPrice', value)}
              placeholder="Max"
              className="react-widget"
            />
          </div>

          {/* Postcode */}
          <div className="form-group">
            <label htmlFor="postcode">Postcode Area</label>
            <input
              id="postcode"
              type="text"
              placeholder="e.g. BR5, NW1"
              value={filters.postcode || ''}
              onChange={e => handleChange('postcode', sanitizeInput(e.target.value))}
              maxLength="4"
              pattern="[A-Za-z0-9]{2,4}"
            />
          </div>
        </div>

        {/* ================= ROW 2 – FILTERS + ACTIONS ================= */}
        <div className="form-row actions-row">
          {/* Min Bedrooms */}
          <div className="form-group">
            <label htmlFor="min-bedrooms">Min Beds</label>
            <NumberPicker
              id="min-bedrooms"
              min={1}
              max={10}
              value={filters.minBedrooms || ''}
              onChange={value => handleChange('minBedrooms', value)}
              placeholder="Min"
              className="react-widget"
            />
          </div>

          {/* Max Bedrooms */}
          <div className="form-group">
            <label htmlFor="max-bedrooms">Max Beds</label>
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

          {/* Date */}
          <div className="form-group">
            <label htmlFor="date-added">Added After</label>
            <DatePicker
              id="date-added"
              selected={filters.dateFrom}
              onChange={date => handleChange('dateFrom', date)}
              placeholderText="Select date"
              dateFormat="dd/MM/yyyy"
              isClearable
            />
            {filters.dateFrom && (
              <span className="date-display">
                {formatDate(filters.dateFrom)}
              </span>
            )}
          </div>

          {/* Search Button */}
          <button type="submit" className="search-btn">
            🔍 Search
          </button>

          {/* Clear Button */}
          <button
            type="button"
            className="clear-btn"
            onClick={handleClearAll}
          >
            🗑️ Clear
          </button>
        </div>

      </form>
    </div>
  );
};

export default SearchForm;
