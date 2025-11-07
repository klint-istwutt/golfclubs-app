"use client";

import dynamic from "next/dynamic";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- Typdefinition für Club ---
export interface Club {
  id: number;
  name: string;
  city: string;
  country: string;
  rating?: number;
  lat?: number;
  lon?: number;
}

// --- Leaflet Icon Fix ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// --- Dynamischer Import für Next.js ---
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

interface ClubMapProps {
  clubs: Club[];
}

export default function ClubMap({ clubs }: ClubMapProps) {
  // --- Karte nur rendern, wenn mindestens ein Club Koordinaten hat ---
  const firstWithCoords = clubs.find(c => c.lat !== undefined && c.lon !== undefined);
  if (!firstWithCoords) return null;

  const mapCenter: [number, number] = [firstWithCoords.lat!, firstWithCoords.lon!];

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
      {clubs.map(club => club.lat && club.lon && (
        <Marker key={club.id} position={[club.lat, club.lon]}>
          <Popup>
            <strong>{club.name}</strong><br/>
            {club.city}, {club.country}<br/>
            Rating: {club.rating?.toFixed(1)}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
