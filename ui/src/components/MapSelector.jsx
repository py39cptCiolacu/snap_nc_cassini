import React, { useState, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Rectangle,
  Marker,
  Tooltip,
  useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MDBBtn } from 'mdb-react-ui-kit';
import * as turf from '@turf/turf';
import './MapSelector.css';

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

function MapSelector({
  onAreaSelected,
  clearMarkers,
  setCalculatedArea,
  calculatedArea,
}) {
  const [rectangleBounds, setRectangleBounds] = useState(null);
  const [cornerMarkers, setCornerMarkers] = useState([]);
  const isDragging = useRef(false);
  const startLatLng = useRef(null);

  function RectangleSelector() {
    useMapEvents({
      mousedown(e) {
        if (e.originalEvent.shiftKey && e.originalEvent.button === 0) {
          // Start rectangle selection
          isDragging.current = true;
          startLatLng.current = e.latlng;
        }
      },
      mousemove(e) {
        if (isDragging.current && startLatLng.current) {
          // Update rectangle bounds
          const bounds = L.latLngBounds(startLatLng.current, e.latlng);
          setRectangleBounds(bounds);
        }
      },
      mouseup(e) {
        if (isDragging.current && startLatLng.current) {
          // Finish rectangle selection
          isDragging.current = false;
          const bounds = L.latLngBounds(startLatLng.current, e.latlng);
          setRectangleBounds(bounds);

          // Extract corner points
          const corners = [
            bounds.getSouthWest(),
            bounds.getNorthWest(),
            bounds.getNorthEast(),
            bounds.getSouthEast(),
          ];

          // Set corner markers
          setCornerMarkers(corners);

          // Calculate area using Turf.js
          const linearRing = corners.map((latlng) => [latlng.lng, latlng.lat]);
          // Close the polygon by adding the first point at the end
          linearRing.push([corners[0].lng, corners[0].lat]);

          const polygon = turf.polygon([linearRing]);
          const area = turf.area(polygon) / 1e6; // din m^2 in km^2
          setCalculatedArea(area);

          if (onAreaSelected) {
            onAreaSelected(corners);
          }
        }
      },
    });
    return null;
  }

  const handleClearSelection = () => {
    setRectangleBounds(null);
    setCornerMarkers([]);
    setCalculatedArea(0);
    startLatLng.current = null;
    clearMarkers();
  };

  return (
    <div className="map-container">
      <MapContainer
        center={[45.9432, 24.9668]} // Centrat pe Romania
        zoom={7}
        className="leaflet-container"
      >
        {/* Map layers */}
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RectangleSelector />
        {/* Draw Rectangle */}
        {rectangleBounds && (
          <Rectangle bounds={rectangleBounds} color="#2E8B57" />
        )}
        {/* Corner Markers */}
        {cornerMarkers.map((latlng, idx) => (
          <Marker key={idx} position={latlng}>
            <Tooltip direction="top" offset={[0, -20]} opacity={1}>
              Lat: {latlng.lat.toFixed(4)}, Lng: {latlng.lng.toFixed(4)}
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>

      {/* Reset Button */}
      <MDBBtn
        color="danger"
        size="sm"
        className="reset-button"
        onClick={handleClearSelection}
      >
        Reset Selection
      </MDBBtn>
    </div>
  );
}

export default MapSelector;