import React from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { geometryToLatLngs } from "../utils/geometry";


import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function MapView({ depart, arrivee, geometry }) {
  const center = depart?.lat ? [depart.lat, depart.lon] : [48.8566, 2.3522];
  const line = geometryToLatLngs(geometry);

  return (
    <div className="map">
      <MapContainer center={center} zoom={13} style={{ height: 420, width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {depart?.lat && (
          <Marker position={[depart.lat, depart.lon]}>
            <Popup>Départ</Popup>
          </Marker>
        )}

        {arrivee?.lat && (
          <Marker position={[arrivee.lat, arrivee.lon]}>
            <Popup>Arrivée</Popup>
          </Marker>
        )}

        {line.length > 0 && <Polyline positions={line} />}
      </MapContainer>
    </div>
  );
}
