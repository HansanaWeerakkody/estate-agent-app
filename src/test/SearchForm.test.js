import { render, screen, fireEvent } from '@testing-library/react';
import SearchForm from '../components/SearchForm';

describe('SearchForm Component', () => {
  const mockFilters = {
    type: 'any',
    minPrice: '',
    maxPrice: '',
    minBedrooms: '',
    maxBedrooms: '',
    postcode: '',
    dateFrom: null
  };

  const mockSetFilters = jest.fn();
  const mockOnSearch = jest.fn();

  test('renders all form elements', () => {
    render(
      <SearchForm 
        filters={mockFilters}
        setFilters={mockSetFilters}
        onSearch={mockOnSearch}
      />
    );

    expect(screen.getByLabelText(/Property Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Min Price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Max Price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Min Bedrooms/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Max Bedrooms/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Postcode Area/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Added After/i)).toBeInTheDocument();
    expect(screen.getByText(/Search Properties/i)).toBeInTheDocument();
  });

  test('calls onSearch when form is submitted', () => {
    render(
      <SearchForm 
        filters={mockFilters}
        setFilters={mockSetFilters}
        onSearch={mockOnSearch}
      />
    );

    const searchButton = screen.getByText(/Search Properties/i);
    fireEvent.click(searchButton);
    
    expect(mockOnSearch).toHaveBeenCalledWith(mockFilters);
  });

  test('updates filters when input changes', () => {
    render(
      <SearchForm 
        filters={mockFilters}
        setFilters={mockSetFilters}
        onSearch={mockOnSearch}
      />
    );

    const postcodeInput = screen.getByLabelText(/Postcode Area/i);
    fireEvent.change(postcodeInput, { target: { value: 'BR5' } });
    
    expect(mockSetFilters).toHaveBeenCalledWith({
      ...mockFilters,
      postcode: 'BR5'
    });
  });

  test('clears filters when clear button is clicked', () => {
    render(
      <SearchForm 
        filters={{...mockFilters, postcode: 'BR5'}}
        setFilters={mockSetFilters}
        onSearch={mockOnSearch}
      />
    );

    const clearButton = screen.getByText(/Clear All/i);
    fireEvent.click(clearButton);
    
    expect(mockSetFilters).toHaveBeenCalledWith({
      type: 'any',
      minPrice: '',
      maxPrice: '',
      minBedrooms: '',
      maxBedrooms: '',
      postcode: '',
      dateFrom: null
    });
  });
});