import React, { useRef } from 'react';

const FavouritesList = ({ favourites, onRemove, onClear }) => {
  const dragItem = useRef();
  const dragOverItem = useRef();

  const handleDropAdd = (e) => {
    e.preventDefault();
    const propertyId = e.dataTransfer.getData('propertyId');
    // In a real app, you'd find the property and add it
    console.log('Property dropped to add:', propertyId);
  };

  const handleDropRemove = (e) => {
    e.preventDefault();
    const propertyId = e.dataTransfer.getData('propertyId');
    if (propertyId) {
      onRemove(propertyId);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragStart = (e, index) => {
    dragItem.current = index;
  };

  const handleDragEnter = (e, index) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current !== dragOverItem.current) {
      // Handle reordering if needed
      console.log('Reordered favourites');
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  // Security: Escape HTML for display
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
            <p className="empty-msg">Drag properties here or use the Save button</p>
            <div 
              className="drop-zone"
              onDrop={handleDropAdd}
              onDragOver={handleDragOver}
            >
              <p>Drop zone for adding properties</p>
            </div>
          </div>
        ) : (
          <>
            <ul className="fav-list">
              {favourites.map((fav, index) => (
                <li 
                  key={fav.id} 
                  className="favourite-item"
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnter={(e) => handleDragEnter(e, index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                >
                  <div className="fav-info">
                    <strong>{escapeHTML(fav.type)} - £{fav.price.toLocaleString()}</strong>
                    <span>{escapeHTML(fav.location.split(',')[0])}</span>
                  </div>
                  <div className="fav-actions">
                    <button 
                      onClick={() => onRemove(fav.id)}
                      className="remove-btn"
                      aria-label={`Remove ${fav.type}`}
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            
            {/* Drop zone for removing by drag */}
            <div 
              className="remove-drop-zone"
              onDrop={handleDropRemove}
              onDragOver={handleDragOver}
            >
              <p>🗑️ Drag here to remove from favourites</p>
            </div>
            
            <div className="favourites-actions">
              <button onClick={onClear} className="clear-btn">
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