import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchPage from '../Components/SearchPage';

// Mock properties data
const mockProperties = [
  {
    id: 1,
    type: 'House',
    price: 500000,
    bedrooms: 3,
    location: '123 Test Street, London, BR5',
    description: 'A beautiful house in London',
    picture: './images/prop1small.jpg',
    tenure: 'Freehold',
    added: { day: 1, month: 'January', year: 2023 }
  }
];

// Mock callback functions
const mockOnSearch = jest.fn();
const mockAddFav = jest.fn();
const mockRemoveFav = jest.fn();
const mockClearFav = jest.fn();
const mockOnPropertyClick = jest.fn();
const mockOnClear = jest.fn();

const mockFavourites = [mockProperties[0]];

describe('SearchPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('1. Renders all properties by default', () => {
    render(
      <SearchPage
        properties={mockProperties}
        onSearch={mockOnSearch}
        favourites={mockFavourites}
        addFav={mockAddFav}
        removeFav={mockRemoveFav}
        clearFav={mockClearFav}
        onPropertyClick={mockOnPropertyClick}
        onClear={mockOnClear}
      />
    );

    // Check header shows all properties
    expect(screen.getByText(/Available Properties/i)).toBeInTheDocument();
  });

  test('2. Shows search form elements', () => {
    render(
      <SearchPage
        properties={mockProperties}
        onSearch={mockOnSearch}
        favourites={mockFavourites}
        addFav={mockAddFav}
        removeFav={mockRemoveFav}
        clearFav={mockClearFav}
        onPropertyClick={mockOnPropertyClick}
        onClear={mockOnClear}
      />
    );

    // Option 1: Check by aria-label (more specific)
    expect(screen.getByRole('button', { name: 'Search properties' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear all filters' })).toBeInTheDocument();
    
    // Option 2: OR check by button text (if buttons have visible text)
    // Using getAllByText and checking if they're inside buttons
    const searchButtons = screen.getAllByText('Search');
    const clearButtons = screen.getAllByText('Clear');
    
    // Find which ones are actually buttons
    const searchButton = searchButtons.find(btn => btn.closest('button'));
    const clearButton = clearButtons.find(btn => btn.closest('button'));
    
    if (searchButton) expect(searchButton).toBeInTheDocument();
    if (clearButton) expect(clearButton).toBeInTheDocument();
  });

  test('3. Clears filters when clear button is clicked', () => {
    render(
      <SearchPage
        properties={mockProperties}
        onSearch={mockOnSearch}
        favourites={mockFavourites}
        addFav={mockAddFav}
        removeFav={mockRemoveFav}
        clearFav={mockClearFav}
        onPropertyClick={mockOnPropertyClick}
        onClear={mockOnClear}
      />
    );

    // Use the correct aria-label
    const clearButton = screen.getByRole('button', { name: 'Clear all filters' });
    fireEvent.click(clearButton);
    
    expect(mockOnClear).toHaveBeenCalled();
  });

  test('4. Displays favourites list', () => {
    render(
      <SearchPage
        properties={mockProperties}
        onSearch={mockOnSearch}
        favourites={mockFavourites}
        addFav={mockAddFav}
        removeFav={mockRemoveFav}
        clearFav={mockClearFav}
        onPropertyClick={mockOnPropertyClick}
        onClear={mockOnClear}
      />
    );

    // Check favourites list is displayed
    expect(screen.getByText('❤️ Favourites (1)')).toBeInTheDocument();
  });

  test('5. Handles empty properties state', () => {
    render(
      <SearchPage
        properties={[]}
        onSearch={mockOnSearch}
        favourites={[]}
        addFav={mockAddFav}
        removeFav={mockRemoveFav}
        clearFav={mockClearFav}
        onPropertyClick={mockOnPropertyClick}
        onClear={mockOnClear}
      />
    );

    // Should show no results message - check for any text containing "No properties"
    const noResultsElement = screen.getByText(/No properties found/i);
    expect(noResultsElement).toBeInTheDocument();
  });
});