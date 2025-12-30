import { render, screen, fireEvent } from '@testing-library/react';
import PropertyCard from '../components/PropertyCard';

const mockProperty = {
  id: "prop1",
  type: "House",
  bedrooms: 3,
  price: 750000,
  tenure: "Freehold",
  description: "Test property description",
  location: "Test Location, BR5",
  picture: "./images/test.jpg",
  added: {
    month: "October",
    day: 12,
    year: 2022
  }
};

describe('PropertyCard Component', () => {
  const mockOnPropertyClick = jest.fn();
  const mockOnAddToFavourites = jest.fn();

  test('renders property information correctly', () => {
    render(
      <PropertyCard 
        property={mockProperty}
        onPropertyClick={mockOnPropertyClick}
        onAddToFavourites={mockOnAddToFavourites}
      />
    );

    expect(screen.getByText(/House in Test Location/i)).toBeInTheDocument();
    expect(screen.getByText(/£750,000/i)).toBeInTheDocument();
    expect(screen.getByText(/3 bed/i)).toBeInTheDocument();
    expect(screen.getByText(/Freehold/i)).toBeInTheDocument();
    expect(screen.getByText(/View Details/i)).toBeInTheDocument();
    expect(screen.getByText(/Save/i)).toBeInTheDocument();
  });

  test('calls onPropertyClick when card is clicked', () => {
    render(
      <PropertyCard 
        property={mockProperty}
        onPropertyClick={mockOnPropertyClick}
        onAddToFavourites={mockOnAddToFavourites}
      />
    );

    const propertyCard = screen.getByText(/House in Test Location/i).closest('.property-card');
    fireEvent.click(propertyCard);
    
    expect(mockOnPropertyClick).toHaveBeenCalledWith(mockProperty);
  });

  test('calls onAddToFavourites when save button is clicked', () => {
    render(
      <PropertyCard 
        property={mockProperty}
        onPropertyClick={mockOnPropertyClick}
        onAddToFavourites={mockOnAddToFavourites}
      />
    );

    const saveButton = screen.getByText(/Save/i);
    fireEvent.click(saveButton);
    
    expect(mockOnAddToFavourites).toHaveBeenCalledWith(mockProperty);
  });

  test('does not propagate click event from save button', () => {
    render(
      <PropertyCard 
        property={mockProperty}
        onPropertyClick={mockOnPropertyClick}
        onAddToFavourites={mockOnAddToFavourites}
      />
    );

    const saveButton = screen.getByText(/Save/i);
    const propertyCard = saveButton.closest('.property-card');
    
    // Mock stopPropagation
    const stopPropagation = jest.fn();
    const clickEvent = { stopPropagation };
    
    fireEvent.click(saveButton, clickEvent);
    
    // onPropertyClick should not be called
    expect(mockOnPropertyClick).not.toHaveBeenCalled();
  });
});