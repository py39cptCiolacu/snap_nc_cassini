import React from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  useMapEvents,
  Tooltip,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapSelector.css';

// Fix Leaflet's icon paths with Vite -- cica
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

function MapSelector({ markers, onAreaSelected, clearMarkers }) {
  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;

        if (onAreaSelected) {
          onAreaSelected({ lat, lng });
        }
      },
    });
    return null;
  }

  const polygonPositions = markers.map((marker) => [marker.lat, marker.lng]);

  return (
    <div className="map-container-wrapper">
      <MapContainer
        center={[45.9432, 24.9668]} // Romania
        zoom={7} // TBD daca ramane asa sau il modificam
        className="map-container"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
        {markers.map((marker, idx) => (
          <Marker key={idx} position={[marker.lat, marker.lng]}>
            <Tooltip direction="top" offset={[0, -20]} opacity={1}>
              Lat: {marker.lat.toFixed(4)}, Lng: {marker.lng.toFixed(4)}
            </Tooltip>
          </Marker>
        ))}
        {markers.length >= 3 && (
          <Polygon positions={polygonPositions} color="#2E8B57" />
        )}
      </MapContainer>

      {/* Reset Button as Overlay */}
      <button className="reset-button" onClick={clearMarkers}>
        Reset Selection
      </button>
    </div>
  );
}

export default MapSelector;