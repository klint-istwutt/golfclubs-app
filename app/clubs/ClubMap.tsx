"use client";

import dynamic from "next/dynamic";
import L from "leaflet";
import React from "react";

import "leaflet/dist/leaflet.css";

// Leaflet Marker fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Dynamischer Import von React-Leaflet
const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(m => m.Popup), { ssr: false });

// Typdefinition lokal
export interface Club {
  id: number;
  name: string;
  city: string;
  country: string;
  logo_url: string;
  rating?: number;
  lat?: number;
  lon?: number;
}

interface ClubMapProps {
  clubs: Club[];
}

export default function ClubMap({ clubs }: ClubMapProps) {
  if (!clubs.length || !clubs.some(c => c.lat && c.lon)) return null;

  const firstClubWithCoords = clubs.find(c => c.lat && c.lon)!;

  return (
    <MapContainer
      style={{ height: "400px", width: "100%", marginTop: "20px", borderRadius: "12px" }}
      center={[firstClubWithCoords.lat!, firstClubWithCoords.lon!] as [number, number]}
      zoom={4}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {clubs.map(club => club.lat && club.lon && (
        <Marker key={club.id} position={[club.lat, club.lon] as [number, number]}>
          <Popup>
            <strong>{club.name}</strong><br />
            {club.city}, {club.country}<br />
            Rating: {club.rating?.toFixed(1)}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
