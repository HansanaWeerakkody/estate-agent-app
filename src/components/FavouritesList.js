import React from 'react';

const FavouritesList = ({ favourites, onRemove, onClear }) => {
  const handleDrop = (e) => {
    e.preventDefault();
    const propertyId = e.dataTransfer.getData('propertyId');
    console.log('Property dropped:', propertyId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div 
      className="favourites-zone"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <h3>Favourites ({favourites.length})</h3>
      
      {favourites.length === 0 ? (
        <p className="empty-msg">Drag properties here or use the Save button</p>
      ) : (
        <>
          <ul className="fav-list">
            {favourites.map(fav => (
              <li key={fav.id} className="favourite-item">
                <div className="fav-info">
                  <strong>{fav.type} - £{fav.price.toLocaleString()}</strong>
                  <span>{fav.location.split(',')[0]}</span>
                </div>
                <button 
                  onClick={() => onRemove(fav.id)}
                  className="remove-btn"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
          <button onClick={onClear} className="clear-btn">
            Clear All Favourites
          </button>
        </>
      )}
    </div>
  );
};

export default FavouritesList;