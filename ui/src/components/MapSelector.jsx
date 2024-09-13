import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's icon paths with Vite
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL(
    'leaflet/dist/images/marker-icon-2x.png',
    import.meta.url
  ).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL(
    'leaflet/dist/images/marker-shadow.png',
    import.meta.url
  ).href,
});

function MapSelector({ onAreaSelected }) {
  const [markers, setMarkers] = useState([]);

  // Component to handle map events
  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;

        // Add new marker
        setMarkers((prevMarkers) => [...prevMarkers, { lat, lng }]);

        // Pass selected area to the parent component
        if (onAreaSelected) {
          onAreaSelected({ lat, lng });
        }
      },
    });

    return null;
  }

  return (
    <MapContainer
      center={[0, 0]} // Center the map at the equator
      zoom={2} // Zoom level to show the whole world
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <LocationMarker />
      {markers.map((marker, idx) => (
        <Marker key={idx} position={[marker.lat, marker.lng]}></Marker>
      ))}
    </MapContainer>
  );
}

export default MapSelector;