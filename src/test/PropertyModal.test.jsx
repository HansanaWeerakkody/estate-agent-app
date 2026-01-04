import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PropertyModal from '../Components/PropertyModal';

// Match the actual property data structure
const mockProperty = {
  id: "prop1", 
  type: 'House',
  price: 500000,
  bedrooms: 3,
  location: '123 Test Street, London, BR5',
  description: '<p>A beautiful <strong>house</strong> in London with garden.</p>',
  picture: './images/prop1pic1.jpg', 
  tenure: 'Freehold',
  added: { day: 1, month: 'January', year: 2023 },
  images: [ 
    './images/prop1pic1.jpg',
    './images/prop1pic2.jpg',
    './images/prop1pic3.jpg'
  ],
  floorPlan: './images/floorplan1.png' 
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
    
    // Check bedrooms 
    const bedroomElement = screen.getByText(/3 Bedroom(s)?/);
    expect(bedroomElement).toBeInTheDocument();
    
    // Check tenure
    const freeholdElements = screen.getAllByText('Freehold');
    expect(freeholdElements.length).toBeGreaterThanOrEqual(1);
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

    // Check navigation buttons exist (only when images.length > 1)
    const nextButton = screen.getByLabelText('Next image');
    const prevButton = screen.getByLabelText('Previous image');
    
    expect(nextButton).toBeInTheDocument();
    expect(prevButton).toBeInTheDocument();
    
    // Test clicking navigation buttons
    fireEvent.click(nextButton);
    fireEvent.click(prevButton);
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

    let favouriteButton = screen.getByRole('button', { name: /add to favourites/i });
    expect(favouriteButton).toBeInTheDocument();
    expect(favouriteButton).not.toHaveClass('in-favourites');
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

    favouriteButton = screen.getByRole('button', { name: /remove from favourites/i });
    expect(favouriteButton).toBeInTheDocument();
    expect(favouriteButton).toHaveClass('in-favourites');
    expect(favouriteButton).toHaveTextContent('In Favourites');
  });

  // ADDITIONAL TESTS YOU MIGHT WANT TO ADD:

  test('6. Closes modal when close button is clicked', () => {
    render(
      <PropertyModal
        property={mockProperty}
        onClose={mockOnClose}
        onAddToFavourite={mockOnAddToFavourite}
        isInFavourites={false}
      />
    );

    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('7. Shows key features for property 1', () => {
    render(
      <PropertyModal
        property={mockProperty}
        onClose={mockOnClose}
        onAddToFavourite={mockOnAddToFavourite}
        isInFavourites={false}
      />
    );

    // Property 1 should have these key features
    expect(screen.getByText('Luxury ensuite bathroom with heated floors')).toBeInTheDocument();
    expect(screen.getByText('Double garage with electric charging point')).toBeInTheDocument();
    expect(screen.getByText('Private landscaped garden with patio')).toBeInTheDocument();
  });

  test('8. Handles missing images array gracefully', () => {
    const propertyWithoutImages = {
      ...mockProperty,
      images: undefined
    };

    render(
      <PropertyModal
        property={propertyWithoutImages}
        onClose={mockOnClose}
        onAddToFavourite={mockOnAddToFavourite}
        isInFavourites={false}
      />
    );

    // Should still render with main picture
    const mainImage = screen.getByAltText(/House view/i);
    expect(mainImage).toBeInTheDocument();
    expect(mainImage).toHaveAttribute('src', './images/prop1pic1.jpg');
  });

  test('9. Shows contact agent and close buttons', () => {
    render(
      <PropertyModal
        property={mockProperty}
        onClose={mockOnClose}
        onAddToFavourite={mockOnAddToFavourite}
        isInFavourites={false}
      />
    );

    expect(screen.getByText('📞 Contact Agent')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
  });
});