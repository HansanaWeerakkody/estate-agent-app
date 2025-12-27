import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Mock the properties data
jest.mock('../data/properties.json', () => ({
  properties: [
    {
      id: "prop1",
      type: "House",
      bedrooms: 3,
      price: 750000,
      tenure: "Freehold",
      description: "Test property description",
      location: "Test Location BR5",
      picture: "./images/test.jpg",
      added: {
        month: "October",
        day: 12,
        year: 2022
      }
    },
    {
      id: "prop2",
      type: "Flat",
      bedrooms: 2,
      price: 399995,
      tenure: "Freehold",
      description: "Another test property",
      location: "Another Location BR6",
      picture: "./images/test2.jpg",
      added: {
        month: "September",
        day: 14,
        year: 2022
      }
    }
  ]
}));

describe('App Component', () => {
  test('renders application header', () => {
    render(<App />);
    const headerElement = screen.getByText(/Estate Agent Property Search/i);
    expect(headerElement).toBeInTheDocument();
  });

  test('displays property cards on load', async () => {
    render(<App />);
    // Wait for properties to load
    await waitFor(() => {
      const propertyCards = screen.getAllByText(/bed/i);
      expect(propertyCards.length).toBeGreaterThan(0);
    });
  });

  test('allows searching properties by type', async () => {
    render(<App />);
    
    // Find and select House from dropdown
    const typeSelect = screen.getByLabelText(/Property Type/i);
    fireEvent.change(typeSelect, { target: { value: 'House' } });
    
    // Click search
    const searchButton = screen.getByText(/Search Properties/i);
    fireEvent.click(searchButton);
    
    // Should show only houses
    await waitFor(() => {
      const houses = screen.getAllByText(/House/i);
      expect(houses.length).toBeGreaterThan(0);
    });
  });

  test('allows adding property to favourites', async () => {
    render(<App />);
    
    // Wait for properties to load
    await waitFor(() => {
      const favouriteButtons = screen.getAllByText(/Save/i);
      expect(favouriteButtons.length).toBeGreaterThan(0);
    });
    
    // Click first favourite button
    const firstFavButton = screen.getAllByText(/Save/i)[0];
    fireEvent.click(firstFavButton);
    
    // Check if favourites count increased
    const favouritesCount = screen.getByText(/Favourites \(1\)/i);
    expect(favouritesCount).toBeInTheDocument();
  });

  test('displays property modal when clicking property card', async () => {
    render(<App />);
    
    // Wait for properties to load
    await waitFor(() => {
      const propertyCards = screen.getAllByText(/View Details/i);
      expect(propertyCards.length).toBeGreaterThan(0);
    });
    
    // Click view details on first property
    const firstViewButton = screen.getAllByText(/View Details/i)[0];
    fireEvent.click(firstViewButton);
    
    // Modal should appear with property details
    await waitFor(() => {
      const modalTitle = screen.getByText(/in Test Location/i);
      expect(modalTitle).toBeInTheDocument();
    });
  });
});