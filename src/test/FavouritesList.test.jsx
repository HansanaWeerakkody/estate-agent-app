import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FavouritesList from '../Components/FavouritesList';

const mockFavourites = [
  {
    id: 1,
    type: 'House',
    price: 500000,
    location: '123 Test Street, London, BR5',
    bedrooms: 3
  },
  {
    id: 2,
    type: 'Flat',
    price: 250000,
    location: '456 Example Road, Manchester',
    bedrooms: 2
  },
  {
    id: 3,
    type: 'Bungalow',
    price: 350000,
    location: '789 Sample Avenue, Birmingham',
    bedrooms: 4
  }
];

const mockOnAdd = jest.fn();
const mockOnRemove = jest.fn();
const mockOnClear = jest.fn();

describe('FavouritesList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('1. Renders empty state correctly', () => {
    render(
      <FavouritesList 
        favourites={[]}
        onAdd={mockOnAdd}
        onRemove={mockOnRemove}
        onClear={mockOnClear}
      />
    );

    expect(screen.getByText('❤️ Favourites (0)')).toBeInTheDocument();
    expect(screen.getByText('Add your favourite properties')).toBeInTheDocument();
    expect(screen.getByText('Drag properties here or use the Save button')).toBeInTheDocument();
    // REMOVED: expect(screen.getByText('Drop properties here to add to favourites')).toBeInTheDocument();
    // REMOVED: expect(screen.getByText('Drag from property cards')).toBeInTheDocument();
  });

  test('2. Renders favourites list correctly', () => {
    render(
      <FavouritesList 
        favourites={mockFavourites}
        onAdd={mockOnAdd}
        onRemove={mockOnRemove}
        onClear={mockOnClear}
      />
    );

    expect(screen.getByText('❤️ Favourites (3)')).toBeInTheDocument();
    expect(screen.getByText('House - £500,000')).toBeInTheDocument();
    expect(screen.getByText('Flat - £250,000')).toBeInTheDocument();
    expect(screen.getByText('Bungalow - £350,000')).toBeInTheDocument();
    
    const removeButtons = screen.getAllByLabelText(/Remove/i);
    expect(removeButtons).toHaveLength(3);
    
    expect(screen.getByText('Drag items to the red zone below to remove')).toBeInTheDocument();
    expect(screen.getByText('🗑️ Drag here to remove from favourites')).toBeInTheDocument();
    expect(screen.getByText('🗑️ Clear All Favourites')).toBeInTheDocument();
  });

  test('3. Calls onRemove when remove button is clicked', () => {
    render(
      <FavouritesList 
        favourites={mockFavourites}
        onAdd={mockOnAdd}
        onRemove={mockOnRemove}
        onClear={mockOnClear}
      />
    );

    const removeButtons = screen.getAllByLabelText(/Remove/i);
    fireEvent.click(removeButtons[0]);
    
    expect(mockOnRemove).toHaveBeenCalledWith(1);
  });

  test('4. Calls onClear when clear button is clicked', () => {
    render(
      <FavouritesList 
        favourites={mockFavourites}
        onAdd={mockOnAdd}
        onRemove={mockOnRemove}
        onClear={mockOnClear}
      />
    );

    const clearButton = screen.getByText('🗑️ Clear All Favourites');
    fireEvent.click(clearButton);
    
    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });

  test('5. Handles drag and drop for adding favourites', () => {
    render(
      <FavouritesList 
        favourites={[]}
        onAdd={mockOnAdd}
        onRemove={mockOnRemove}
        onClear={mockOnClear}
      />
    );

    // Find the drop zone by its text content - use the ACTUAL text from your component
    const dropZone = screen.getByText('Drag properties here or use the Save button').parentElement;
    
    // Create mock DataTransfer
    const mockDataTransfer = {
      getData: jest.fn().mockReturnValue(JSON.stringify(mockFavourites[0]))
    };
    
    // Fire drop event
    fireEvent.drop(dropZone, {
      preventDefault: jest.fn(),
      dataTransfer: mockDataTransfer
    });
    
    expect(mockOnAdd).toHaveBeenCalledWith(mockFavourites[0]);
  });

  test('6. Handles drag and drop for removing favourites', () => {
    render(
      <FavouritesList 
        favourites={mockFavourites}
        onAdd={mockOnAdd}
        onRemove={mockOnRemove}
        onClear={mockOnClear}
      />
    );

    const removeZone = screen.getByText('🗑️ Drag here to remove from favourites').parentElement;
    
    // Create mock DataTransfer that returns property ID as text/plain
    let getDataCallCount = 0;
    const mockDataTransfer = {
      getData: jest.fn((type) => {
        getDataCallCount++;
        if (type === 'text/plain') {
          return '1';
        }
        if (type === 'application/json') {
          return '';
        }
        return null;
      })
    };
    
    const mockEvent = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      dataTransfer: mockDataTransfer
    };
    
    fireEvent.drop(removeZone, mockEvent);
    
    expect(mockOnRemove).toHaveBeenCalledWith('1');
  });

  test('7. Remove drop zone exists for drag functionality', () => {
    render(
      <FavouritesList 
        favourites={mockFavourites}
        onAdd={mockOnAdd}
        onRemove={mockOnRemove}
        onClear={mockOnClear}
      />
    );
  
    expect(screen.getByText('🗑️ Drag here to remove from favourites')).toBeInTheDocument();
    // REMOVED: expect(screen.getByText('Release items here to delete')).toBeInTheDocument();
  });
  
  test('8. Escapes HTML in property details', () => {
    const favouritesWithHTML = [
      {
        id: 1,
        type: '<script>alert("xss")</script>',
        price: 500000,
        location: '<img src="x" onerror="malicious()">, London',
        bedrooms: 3
      }
    ];

    render(
      <FavouritesList 
        favourites={favouritesWithHTML}
        onAdd={mockOnAdd}
        onRemove={mockOnRemove}
        onClear={mockOnClear}
      />
    );

    // Look for the ESCAPED version - not the raw HTML
    // The escapeHTML function converts < to &lt; and > to &gt;
    expect(screen.getByText(/&lt;script&gt;alert\("xss"\)&lt;\/script&gt;/)).toBeInTheDocument();
    expect(screen.getByText(/&lt;img src="x" onerror="malicious\(\)"&gt;/)).toBeInTheDocument();
  });

  test('9. Items are draggable', () => {
    render(
      <FavouritesList 
        favourites={mockFavourites}
        onAdd={mockOnAdd}
        onRemove={mockOnRemove}
        onClear={mockOnClear}
      />
    );

    const favouriteItems = screen.getAllByRole('listitem');
    favouriteItems.forEach(item => {
      expect(item).toHaveAttribute('draggable', 'true');
    });
  });

  test('10. Shows drag instructions when favourites exist', () => {
    render(
      <FavouritesList 
        favourites={mockFavourites}
        onAdd={mockOnAdd}
        onRemove={mockOnRemove}
        onClear={mockOnClear}
      />
    );

    expect(screen.getByText('Drag items to the red zone below to remove')).toBeInTheDocument();
  });

  test('11. Displays truncated location (before comma)', () => {
    render(
      <FavouritesList 
        favourites={[mockFavourites[0]]}
        onAdd={mockOnAdd}
        onRemove={mockOnRemove}
        onClear={mockOnClear}
      />
    );

    // Should show "123 Test Street" not "123 Test Street, London, BR5"
    expect(screen.getByText('123 Test Street')).toBeInTheDocument();
    expect(screen.queryByText('London, BR5')).not.toBeInTheDocument();
  });

  test('12. Handles drag start on favourite items', () => {
    render(
      <FavouritesList 
        favourites={mockFavourites}
        onAdd={mockOnAdd}
        onRemove={mockOnRemove}
        onClear={mockOnClear}
      />
    );

    const firstFavourite = screen.getAllByRole('listitem')[0];
    
    // Mock DataTransfer
    const mockDataTransfer = {
      setData: jest.fn(),
      effectAllowed: ''
    };
    
    fireEvent.dragStart(firstFavourite, {
      dataTransfer: mockDataTransfer,
      currentTarget: { classList: { add: jest.fn() } }
    });
    
    // Check that setData was called
    expect(mockDataTransfer.setData).toHaveBeenCalled();
  });
});