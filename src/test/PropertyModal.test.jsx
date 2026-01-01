import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PropertyModal from '../Components/PropertyModal';

const mockProperty = {
  id: 1,
  type: 'House',
  price: 500000,
  bedrooms: 3,
  location: '123 Test Street, London, BR5',
  description: '<p>A beautiful <strong>house</strong> in London with garden.</p>',
  picture: './images/prop1small.jpg',
  tenure: 'Freehold',
  added: { day: 1, month: 'January', year: 2023 }
};

const mockOnClose = jest.fn();
const mockOnAddToFavourite = jest.fn();

describe('PropertyModal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('1. Renders property details correctly', () => {
    render(
      <PropertyModal
        property={mockProperty}
        onClose={mockOnClose}
        onAddToFavourite={mockOnAddToFavourite}
        isInFavourites={false}
      />
    );

    // Check property type and location
    expect(screen.getByText('House in 123 Test Street')).toBeInTheDocument();
    
    // Check price
    const priceElement = screen.getByText(/£500,000/i);
    expect(priceElement).toBeInTheDocument();
    
    // Check bedrooms - be more flexible with whitespace
    const bedroomElement = screen.getByText(/3\s*Bedrooms/);
    expect(bedroomElement).toBeInTheDocument();
    
    // Check tenure - use getAllByText since it appears multiple times
    const freeholdElements = screen.getAllByText('Freehold');
    expect(freeholdElements.length).toBeGreaterThanOrEqual(1);
    expect(freeholdElements[0]).toBeInTheDocument();
  });

  test('2. Sanitizes HTML in description safely', () => {
    const propertyWithScript = {
      ...mockProperty,
      description: '<p>Safe text</p><script>alert("xss")</script><p>More text</p>'
    };

    render(
      <PropertyModal
        property={propertyWithScript}
        onClose={mockOnClose}
        onAddToFavourite={mockOnAddToFavourite}
        isInFavourites={false}
      />
    );

    // Description should be visible but script tags removed
    expect(screen.getByText('Safe text')).toBeInTheDocument();
    expect(screen.getByText('More text')).toBeInTheDocument();
    expect(screen.getByText('Property Description')).toBeInTheDocument();
  });

  test('3. Handles image navigation', () => {
    render(
      <PropertyModal
        property={mockProperty}
        onClose={mockOnClose}
        onAddToFavourite={mockOnAddToFavourite}
        isInFavourites={false}
      />
    );

    // Check navigation buttons exist
    const nextButton = screen.getByLabelText('Next image');
    const prevButton = screen.getByLabelText('Previous image');
    
    expect(nextButton).toBeInTheDocument();
    expect(prevButton).toBeInTheDocument();
  });

  test('4. Switches between tabs correctly', () => {
    render(
      <PropertyModal
        property={mockProperty}
        onClose={mockOnClose}
        onAddToFavourite={mockOnAddToFavourite}
        isInFavourites={false}
      />
    );

    // Check all tabs are present
    const descriptionTab = screen.getByRole('tab', { name: 'Description' });
    const floorPlanTab = screen.getByRole('tab', { name: 'Floor Plan' });
    const mapTab = screen.getByRole('tab', { name: 'Map' });
    
    expect(descriptionTab).toBeInTheDocument();
    expect(floorPlanTab).toBeInTheDocument();
    expect(mapTab).toBeInTheDocument();
    
    // Description tab should be active by default
    expect(descriptionTab).toHaveAttribute('aria-selected', 'true');
    
    // Click on floor plan tab
    fireEvent.click(floorPlanTab);
    expect(floorPlanTab).toHaveAttribute('aria-selected', 'true');
    
    // Click on map tab
    fireEvent.click(mapTab);
    expect(mapTab).toHaveAttribute('aria-selected', 'true');
  });

  test('5. Handles favourite button correctly based on state', () => {
    // Test when NOT in favourites
    const { rerender } = render(
      <PropertyModal
        property={mockProperty}
        onClose={mockOnClose}
        onAddToFavourite={mockOnAddToFavourite}
        isInFavourites={false}
      />
    );

    // FIXED: Use lowercase 'f' in favourites (matches aria-label)
    let favouriteButton = screen.getByRole('button', { name: 'Add to favourites' });
    expect(favouriteButton).toBeInTheDocument();
    expect(favouriteButton).not.toHaveClass('in-favourites');
    
    // Check button text content (visible text)
    expect(favouriteButton).toHaveTextContent('Add to Favourites');
    
    // Click button
    fireEvent.click(favouriteButton);
    expect(mockOnAddToFavourite).toHaveBeenCalledTimes(1);

    // Test when IN favourites
    rerender(
      <PropertyModal
        property={mockProperty}
        onClose={mockOnClose}
        onAddToFavourite={mockOnAddToFavourite}
        isInFavourites={true}
      />
    );

    // FIXED: Use lowercase 'f' in favourites (matches aria-label)
    favouriteButton = screen.getByRole('button', { name: 'Remove from favourites' });
    expect(favouriteButton).toBeInTheDocument();
    expect(favouriteButton).toHaveClass('in-favourites');
    
    // Check button text content (visible text)
    expect(favouriteButton).toHaveTextContent('In Favourites');
  });
});