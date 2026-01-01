import React from 'react';
import { render, screen } from '@testing-library/react';
import PropertyList from '../Components/PropertyList';

// Mock the PropertyCard component - CORRECT PATH
jest.mock('../Components/PropertyCard', () => {
  return function MockPropertyCard({ property }) {
    return (
      <div data-testid={`property-card-${property.id}`}>
        Mock Property: {property.type} - £{property.price}
      </div>
    );
  };
});

const mockProperties = [
  {
    id: 1,
    type: 'House',
    price: 500000,
    bedrooms: 3,
    location: 'London',
    description: 'A beautiful house',
    picture: './image1.jpg',
    tenure: 'Freehold'
  },
  {
    id: 2,
    type: 'Flat',
    price: 250000,
    bedrooms: 2,
    location: 'Manchester',
    description: 'Modern flat',
    picture: './image2.jpg',
    tenure: 'Leasehold'
  },
  {
    id: 3,
    type: 'Bungalow',
    price: 350000,
    bedrooms: 4,
    location: 'Birmingham',
    description: 'Spacious bungalow',
    picture: './image3.jpg',
    tenure: 'Freehold'
  }
];

const mockOnPropertyClick = jest.fn();
const mockOnAddToFavourites = jest.fn();

describe('PropertyList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('1. Renders property cards when properties exist', () => {
    render(
      <PropertyList 
        properties={mockProperties}
        onPropertyClick={mockOnPropertyClick}
        onAddToFavourites={mockOnAddToFavourites}
      />
    );

    // Should not show "no results" message
    expect(screen.queryByText('No properties found matching your criteria.')).not.toBeInTheDocument();
    
    // Should render all property cards
    expect(screen.getByTestId('property-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('property-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('property-card-3')).toBeInTheDocument();
    
    // Should show mock property content
    expect(screen.getByText('Mock Property: House - £500000')).toBeInTheDocument();
    expect(screen.getByText('Mock Property: Flat - £250000')).toBeInTheDocument();
    expect(screen.getByText('Mock Property: Bungalow - £350000')).toBeInTheDocument();
  });

  test('2. Displays no results message when properties array is empty', () => {
    render(
      <PropertyList 
        properties={[]}
        onPropertyClick={mockOnPropertyClick}
        onAddToFavourites={mockOnAddToFavourites}
      />
    );

    // Should show "no results" message
    expect(screen.getByText('No properties found matching your criteria.')).toBeInTheDocument();
    
    // Should not render any property cards
    expect(screen.queryByTestId('property-card-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('property-card-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('property-card-3')).not.toBeInTheDocument();
  });

  test('3. Renders correct number of property cards', () => {
    render(
      <PropertyList 
        properties={mockProperties}
        onPropertyClick={mockOnPropertyClick}
        onAddToFavourites={mockOnAddToFavourites}
      />
    );

    // Should render exactly 3 property cards
    const propertyCards = screen.getAllByTestId(/property-card-/);
    expect(propertyCards).toHaveLength(3);
  });

  test('4. Handles single property correctly', () => {
    const singleProperty = [mockProperties[0]];
    
    render(
      <PropertyList 
        properties={singleProperty}
        onPropertyClick={mockOnPropertyClick}
        onAddToFavourites={mockOnAddToFavourites}
      />
    );

    // Should render only one property card
    expect(screen.getByTestId('property-card-1')).toBeInTheDocument();
    expect(screen.queryByTestId('property-card-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('property-card-3')).not.toBeInTheDocument();
    
    // Should not show "no results" message
    expect(screen.queryByText('No properties found matching your criteria.')).not.toBeInTheDocument();
  });

  test('5. No React key warnings', () => {
    const consoleSpy = jest.spyOn(console, 'error');
    
    render(
      <PropertyList 
        properties={mockProperties}
        onPropertyClick={mockOnPropertyClick}
        onAddToFavourites={mockOnAddToFavourites}
      />
    );
    
    // Check for no React key warnings
    const keyWarnings = consoleSpy.mock.calls.filter(call => 
      call[0] && call[0].includes('key')
    );
    expect(keyWarnings).toHaveLength(0);
    
    consoleSpy.mockRestore();
  });
});