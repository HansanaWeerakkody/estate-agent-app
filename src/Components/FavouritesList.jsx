import React, { useRef, useState } from 'react';

const FavouritesList = ({ favourites, onAdd, onRemove, onClear }) => {
  const dragItem = useRef();
  const dragOverItem = useRef();
  const [draggedItem, setDraggedItem] = useState(null);

  const handleDropAdd = (e) => {
    e.preventDefault();
    const propertyData = e.dataTransfer.getData('application/json');
    if (propertyData) {
      try {
        const property = JSON.parse(propertyData);
        if (onAdd) {
          onAdd(property);
        }
      } catch (error) {
        console.error('Error parsing dragged property data:', error);
      }
    }
  };

  const handleDropRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    //  Get data from different possible sources
    let propertyId = null;
    
    // First get from text/plain (for favourites items)
    propertyId = e.dataTransfer.getData('text/plain');
    
    // If not found,  get from application/json (for property cards)
    if (!propertyId) {
      try {
        const propertyData = e.dataTransfer.getData('application/json');
        if (propertyData) {
          const property = JSON.parse(propertyData);
          propertyId = property.id;
        }
      } catch (error) {
        console.error('Error parsing property data:', error);
      }
    }
    
    // If  have a property ID, remove it
    if (propertyId && onRemove) {
      onRemove(propertyId);
      setDraggedItem(null); // Reset dragged item
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragStart = (e, favourite) => {
    e.dataTransfer.setData('text/plain', favourite.id);
    e.dataTransfer.setData('application/json', JSON.stringify(favourite));
    e.dataTransfer.effectAllowed = 'copyMove';
    setDraggedItem(favourite.id);
    
    // Add visual feedback
    e.currentTarget.classList.add('dragging');
    
    // Prevent event from bubbling to parent
    e.stopPropagation();
  };

  const handleDragEnd = (e) => {
    // Reset dragged item
    setDraggedItem(null);
    
    // Remove visual feedback from all items
    document.querySelectorAll('.favourite-item').forEach(item => {
      item.classList.remove('dragging', 'drag-over');
    });
    
    // Reset reordering references
    dragItem.current = null;
    dragOverItem.current = null;
    
    e.stopPropagation();
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    dragOverItem.current = index;
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  // Escape HTML for display
  const escapeHTML = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  return (
    <div className="favourites-container">
      <div className="favourites-zone">
        <h3>❤️ Favourites ({favourites.length})</h3>
        
        {favourites.length === 0 ? (
          <div className="empty-state">
            <p className="empty-msg">Add your favourite properties</p>
            <div 
              className="drop-zone"
              onDrop={handleDropAdd}
              onDragOver={handleDragOver}
            >
              <p>Drag properties here or use the Save button</p>
            </div>
          </div>
        ) : (
          <>
            <ul className="fav-list">
              {favourites.map((fav, index) => (
                <li 
                  key={fav.id} 
                  className="favourite-item"
                  draggable="true"
                  onDragStart={(e) => handleDragStart(e, fav)}
                  onDragEnter={(e) => handleDragEnter(e, index)}
                  onDragLeave={handleDragLeave}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                >
                  <div className="fav-info">
                    <strong title={`${fav.type} - £${fav.price.toLocaleString()}`}>
                      {escapeHTML(fav.type)} - £{fav.price.toLocaleString()}
                    </strong>
                    <span title={escapeHTML(fav.location)}>
                      {escapeHTML(fav.location.split(',')[0])}
                    </span>
                  </div>
                  <div className="fav-actions">
                    <button 
                      onClick={() => onRemove(fav.id)}
                      className="remove-btn"
                      aria-label={`Remove ${fav.type}`}
                      title="Click to remove"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            
            <p className="drag-instruction">
              Drag items to the red zone below to remove
            </p>
            
            {/* Drop zone for removing by drag */}
            <div 
              className="remove-drop-zone"
              onDrop={handleDropRemove}
              onDragOver={handleDragOver}
              onClick={(e) => e.stopPropagation()}
            >
              <p>🗑️ Drag here to remove from favourites</p>
            </div>
            
            <div className="favourites-actions">
              <button onClick={onClear} className="clear-favourites-btn">
                🗑️ Clear All Favourites
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FavouritesList;