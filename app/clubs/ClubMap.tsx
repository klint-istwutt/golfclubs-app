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

// Dynamischer Import der gesamten Map-Komponente, nur client-side
const LeafletMap = dynamic(
  async () => {
    const { MapContainer, TileLayer, Marker, Popup } = await import("react-leaflet");
    return function Map({ clubs }: { clubs: Club[] }) {
      const first = clubs.find(c => c.lat && c.lon)!;
      return (
        <MapContainer
          style={{ height: "400px", width: "100%", marginTop: "20px", borderRadius: "12px" }}
          center={[first.lat!, first.lon!] as [number, number]}
          zoom={4}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {clubs.map(c => c.lat && c.lon && (
            <Marker key={c.id} position={[c.lat!, c.lon!] as [number, number]}>
              <Popup>
                <strong>{c.name}</strong><br />
                {c.city}, {c.country}<br />
                Rating: {c.rating?.toFixed(1)}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      );
    };
  },
  { ssr: false }
);

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
  return <LeafletMap clubs={clubs} />;
}
