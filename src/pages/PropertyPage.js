import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import data from '../data/properties.json';

const PropertyPage = ({ addFav }) => {
  const { id } = useParams();
  const property = data.properties.find(p => p.id === id);

  if (!property) return <div style={{padding:'20px'}}>Property not found. <Link to="/">Go Back</Link></div>;

  // Requirement: 6-8 images. Since JSON has only 1, we create an array of 6 copies.
  // In a real app, your JSON would have an array of different images.
  const galleryImages = new Array(6).fill(property.picture);

  return (
    <div className="property-page-container">
      <Link to="/" className="back-link">← Back to Search</Link>
      
      <div className="property-header">
        <h1>{property.location}</h1>
        <h2 className="price">£{property.price.toLocaleString()}</h2>
        <button onClick={() => addFav(property)} className="fav-btn-large">Add to Favourites</button>
      </div>

      {/* Gallery Section */}
      <div className="gallery">
        {galleryImages.map((img, index) => (
          <div key={index} className="gallery-item">
            <img src={`/${img}`} alt={`View ${index + 1}`} />
          </div>
        ))}
      </div>

      {/* Tabs Section */}
      <div className="property-tabs">
        <Tabs>
          <TabList>
            <Tab>Description</Tab>
            <Tab>Floor Plan</Tab>
            <Tab>Map</Tab>
          </TabList>

          <TabPanel>
            <h3>Full Description</h3>
            <p className="long-desc">{property.description}</p>
            <p><strong>Tenure:</strong> {property.tenure}</p>
            <p><strong>Date Added:</strong> {property.added.day} {property.added.month} {property.added.year}</p>
          </TabPanel>
          
          <TabPanel>
            <div className="placeholder-box">
               <p>Floor Plan Image would go here.</p>
               {/* Use property.picture just as a placeholder for assignment if you lack floorplans */}
               <img src={`/${property.picture}`} alt="Floor Plan" style={{filter: 'grayscale(100%)', width: '300px'}}/> 
            </div>
          </TabPanel>
          
          <TabPanel>
            <div className="placeholder-box">
              {/* Google Map iframe */}
              <iframe 
                width="100%" 
                height="400" 
                frameBorder="0" 
                scrolling="no" 
                marginHeight="0" 
                marginWidth="0" 
                src="https://maps.google.com/maps?q=London&t=&z=13&ie=UTF8&iwloc=&output=embed"
                title="Map"
              ></iframe>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default PropertyPage;