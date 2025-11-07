"use client";

import dynamic from "next/dynamic";
import { Club } from "./types"; // Club Typ vom Hauptcode

interface ClubMapProps {
  clubs: Club[];
}

// Leaflet nur Client-seitig, TypScript auf any
const LeafletMapContainer: any = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer: any = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker: any = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup: any = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

import { useEffect, useState } from "react";

export default function ClubMap({ clubs }: ClubMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // CSS nur client-seitig laden
    import("leaflet/dist/leaflet.css");
  }, []);

  // Erste Club-Koordinaten als Map-Center
  const first = clubs.find((c) => c.lat && c.lon);
  const mapCenter: [number, number] = first ? [first.lat!, first.lon!] : [0, 0];

  if (!mounted || !first) return null;

  return (
    <LeafletMapContainer
      style={{ height: 400, width: "100%", marginTop: 20, borderRadius: 12 }}
      center={mapCenter}
      zoom={4}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {clubs.map(
        (club) =>
          club.lat &&
          club.lon && (
            <Marker key={club.id} position={[club.lat!, club.lon!]}>
              <Popup>
                <strong>{club.name}</strong>
                <br />
                {club.city}, {club.country}
                <br />
                Rating: {club.rating?.toFixed(1)}
              </Popup>
            </Marker>
          )
      )}
    </LeafletMapContainer>
  );
}
