"use client";

import dynamic from "next/dynamic";
import L from "leaflet";
import { Club } from "./types"; // Deine Typdefinition

const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(m => m.Popup), { ssr: false });

// Standard Marker fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface ClubMapProps {
  clubs: Club[];
}

export default function ClubMap({ clubs }: ClubMapProps) {
  if (typeof window === "undefined" || clubs.length === 0) return null;

  const mapCenter: L.LatLngExpression = clubs[0].lat && clubs[0].lon
    ? [clubs[0].lat, clubs[0].lon]
    : [0, 0];

  return (
    <MapContainer
      style={{ height: "400px", width: "100%", marginTop: "20px", borderRadius: "12px" }}
      center={mapCenter}
      zoom={4}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {clubs.map(c => c.lat && c.lon && (
        <Marker key={c.id} position={[c.lat, c.lon]}>
          <Popup>
            <strong>{c.name}</strong><br />
            {c.city}, {c.country}<br />
            Rating: {c.rating?.toFixed(1)}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
