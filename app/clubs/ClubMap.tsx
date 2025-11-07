"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
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

// 🧭 Steuerungskomponente (separat, um Map-Instanz zu bekommen)
function MapControl() {
  const map = useMap();

  useEffect(() => {
    // Standardmäßig: Kein Scroll-Zoom
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

    // Zwei-Finger-Zoom bleibt aktiv für Touchgeräte
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

export default function ClubMap({ clubs, mapCenter }: ClubMapProps) {
  useEffect(() => {
    // Leaflet Marker fixen (Pfadproblem vermeiden)
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
      style={{
        height: 400,
        width: "100%",
        marginTop: 20,
        borderRadius: 12,
        zIndex: 0,
      }}
      center={mapCenter}
      zoom={4}
      scrollWheelZoom={false} // Initial deaktiviert
    >
      {/* Tile Layer */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* STRG-/Touch-Steuerung aktivieren */}
      <MapControl />

      {/* Marker */}
      {clubs.map(
        (c) =>
          c.lat &&
          c.lon && (
            <Marker key={c.id} position={[c.lat, c.lon]}>
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
