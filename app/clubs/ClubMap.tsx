"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { LatLngExpression, LatLngBoundsExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";

import { Club } from "../types";

interface ClubMapProps {
  clubs: Club[];
  mapCenter: LatLngExpression;
  onMarkerClick?: (club: Club) => void;
}

// Client-only Map Control
function MapControl() {
  const map = useMap();
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setIsMac(navigator.platform.toUpperCase().includes("MAC"));
    }

    const container = map.getContainer();
    map.scrollWheelZoom.disable();
    map.dragging.disable();
    map.touchZoom.disable();

    const enableZoomPan = (e: KeyboardEvent) => {
      if ((isMac && e.metaKey) || (!isMac && e.key === "Control")) {
        map.scrollWheelZoom.enable();
        map.dragging.enable();
        container.classList.add("ctrl-zoom-active");
      }
    };
    const disableZoomPan = (e: KeyboardEvent) => {
      if ((isMac && !e.metaKey) || (!isMac && e.key === "Control")) {
        map.scrollWheelZoom.disable();
        map.dragging.disable();
        container.classList.remove("ctrl-zoom-active");
      }
    };

    map.touchZoom.enable();
    map.on("touchstart", (e: any) => {
      if (e.touches && e.touches.length < 2) map.dragging.disable();
      else map.dragging.enable();
    });
    map.on("touchend", () => map.dragging.disable());

    document.addEventListener("keydown", enableZoomPan);
    document.addEventListener("keyup", disableZoomPan);

    return () => {
      document.removeEventListener("keydown", enableZoomPan);
      document.removeEventListener("keyup", disableZoomPan);
    };
  }, [map, isMac]);

  return null;
}

// Fit Bounds
function FitBounds({ clubs }: { clubs: Club[] }) {
  const map = useMap();
  useEffect(() => {
    const coords = clubs
      .filter(c => c.lat && c.lon)
      .map(c => [c.lat!, c.lon!]) as [number, number][];
    if (coords.length > 1) map.fitBounds(coords, { padding: [40, 40] });
    else if (coords.length === 1) map.setView(coords[0], 10);
  }, [clubs, map]);

  return null;
}

export default function ClubMap({ clubs, mapCenter, onMarkerClick }: ClubMapProps) {
  const [mounted, setMounted] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof navigator !== "undefined") {
      setIsMac(navigator.platform.toUpperCase().includes("MAC"));
    }

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  if (!mounted) return null; // Client-only Render → Hydration safe

  return (
    <div style={{ position: "relative" }}>
      {/* Map-Hinweis nur Client */}
      {/* Entfernt, da störend: */}
      {/* <div className="map-hint">Halte <strong>{isMac ? "⌘" : "STRG"}</strong> gedrückt...</div> */}

      <MapContainer
        style={{ height: 400, width: "100%", marginTop: 20, borderRadius: 12 }}
        center={mapCenter}
        zoom={4}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapControl />
        <FitBounds clubs={clubs} />
        {clubs.map(
          c =>
            c.lat &&
            c.lon && (
              <Marker
                key={c.id}
                position={[c.lat, c.lon]}
                eventHandlers={{ click: () => onMarkerClick?.(c) }}
              >
                <Popup>
                  <strong>{c.name}</strong>
                  <br />
                  {c.city}, {c.country}
                  <br />
                  Rating: {c.rating?.toFixed(1)}
                </Popup>
              </Marker>
            )
        )}
      </MapContainer>
    </div>
  );
}
