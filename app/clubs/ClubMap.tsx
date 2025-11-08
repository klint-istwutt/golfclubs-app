"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { LatLngExpression, LatLngBoundsExpression } from "leaflet";
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
  onMarkerClick?: (club: Club) => void;
}

// 🧭 STRG + Scroll aktivieren
function MapControl() {
  const map = useMap();

  useEffect(() => {
    map.scrollWheelZoom.disable();
    const container = map.getContainer();

    const enableCtrlZoom = (e: KeyboardEvent) => {
      if (e.key === "Control") {
        map.scrollWheelZoom.enable();
        container.classList.add("ctrl-zoom-active");
      }
    };
    const disableCtrlZoom = (e: KeyboardEvent) => {
      if (e.key === "Control") {
        map.scrollWheelZoom.disable();
        container.classList.remove("ctrl-zoom-active");
      }
    };

    map.touchZoom.enable();
    map.doubleClickZoom.disable();

    document.addEventListener("keydown", enableCtrlZoom);
    document.addEventListener("keyup", disableCtrlZoom);

    return () => {
      document.removeEventListener("keydown", enableCtrlZoom);
      document.removeEventListener("keyup", disableCtrlZoom);
    };
  }, [map]);

  return null;
}

// 🗺️ Auto-Zoom
function FitBounds({ clubs }: { clubs: Club[] }) {
  const map = useMap();

  useEffect(() => {
    const coords = clubs
      .filter((c) => c.lat && c.lon)
      .map((c) => [c.lat!, c.lon!]) as [number, number][];

    if (coords.length > 1) {
      const bounds: LatLngBoundsExpression = coords;
      map.fitBounds(bounds, { padding: [40, 40] });
    } else if (coords.length === 1) {
      map.setView(coords[0], 10);
    }
  }, [clubs, map]);

  return null;
}

export default function ClubMap({ clubs, mapCenter, onMarkerClick }: ClubMapProps) {
  useEffect(() => {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  return (
    <MapContainer
      style={{ height: 400, width: "100%", marginTop: 20, borderRadius: 12, zIndex: 0 }}
      center={mapCenter}
      zoom={4}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapControl />
      <FitBounds clubs={clubs} />
      {clubs.map(
        (c) =>
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
  );
}
