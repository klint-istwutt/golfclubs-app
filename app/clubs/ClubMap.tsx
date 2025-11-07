"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import L from "leaflet";

interface Club {
  id: number;
  name: string;
  city: string;
  country: string;
  rating?: number;
  lat?: number;
  lon?: number;
}

interface ClubMapProps {
  clubs: Club[];
  mapCenter: LatLngExpression;
}

export default function ClubMap({ clubs, mapCenter }: ClubMapProps) {
  useEffect(() => {
    // Leaflet Standard-Marker setzen
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  return (
    <MapContainer
      style={{ height: 400, width: "100%", marginTop: 20, borderRadius: 12 }}
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
