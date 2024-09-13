import React, { useState } from 'react';
import MapSelector from '../components/MapSelector.jsx';

function FormPage() {
  const [selectedCoordinates, setSelectedCoordinates] = useState([]);

  const handleAreaSelected = (coords) => {
    setSelectedCoordinates((prevCoords) => [...prevCoords, coords]);
  };

  return (
    <div className='form-page'>
      <h1>Select Area for Analysis</h1>
      <MapSelector onAreaSelected={handleAreaSelected} />

      <div className='coordinates'>
        <h2>Selected Coordinates</h2>
        <ul>
          {selectedCoordinates.map((coords, index) => (
            <li key={index}>
              Latitude: {coords.lat}, Longitude: {coords.lng}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default FormPage;