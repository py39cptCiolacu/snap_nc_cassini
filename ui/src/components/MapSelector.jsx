import React, { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  useMapEvents,
  Tooltip,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MDBBtn } from 'mdb-react-ui-kit';
import * as turf from '@turf/turf';
import './MapSelector.css';

// Fix Leaflet's icon paths with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url)
    .href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

function MapSelector({ markers, onAreaSelected, clearMarkers, setCalculatedArea }) {
  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;

        // Pass the new marker up to the parent component
        if (onAreaSelected) {
          onAreaSelected({ lat, lng });
        }
      },
    });
    return null;
  }

  // Prepare positions for the Polygon
  const polygonPositions = markers.map((marker) => [marker.lng, marker.lat]); // Note: Turf uses [lng, lat]

  useEffect(() => {
    if (markers.length >= 3) {
      // Create a Turf polygon
      const polygon = turf.polygon([[...polygonPositions, polygonPositions[0]]]); // Close the polygon

      // Calculate the area in square kilometers
      const area = turf.area(polygon) / 1e6; // Convert from square meters to square kilometers

      // Pass the area up to the parent component
      setCalculatedArea(area);
    } else {
      // Reset the area if less than 3 markers
      setCalculatedArea(0);
    }
  }, [markers, polygonPositions, setCalculatedArea]);

  return (
    <div className="map-container-wrapper">
      <MapContainer
        center={[45.9432, 24.9668]} // Center on Romania
        zoom={7}
        className="map-container"
      >
        {/* Map layers */}
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
        {/* Markers */}
        {markers.map((marker, idx) => (
          <Marker key={idx} position={[marker.lat, marker.lng]}>
            <Tooltip direction="top" offset={[0, -20]} opacity={1}>
              Lat: {marker.lat.toFixed(4)}, Lng: {marker.lng.toFixed(4)}
            </Tooltip>
          </Marker>
        ))}
        {/* Polygon */}
        {markers.length >= 3 && (
          <Polygon
            positions={markers.map((marker) => [marker.lat, marker.lng])}
            color="#2E8B57"
          />
        )}
      </MapContainer>

      {/* Reset Button */}
      <MDBBtn
        color="danger"
        size="sm"
        className="reset-button"
        onClick={clearMarkers}
      >
        Reset Selection
      </MDBBtn>
    </div>
  );
}

export default MapSelector;