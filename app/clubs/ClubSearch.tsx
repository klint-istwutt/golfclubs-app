"use client";

import { useState, useMemo, useEffect } from "react";
import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
import dynamic from "next/dynamic";
import { LoginModal } from "./LoginModal";
import toast, { Toaster } from "react-hot-toast";
import "./ClubSearch.css";

interface Club {
  id: number;
  name: string;
  city: string;
  country: string;
  logo_url?: string;
  rating?: number;
  lat?: number;
  lon?: number;
}

interface ClubSearchProps {
  initialClubs?: Club[];
}

const ClubMap = dynamic(() => import("./ClubMap"), { ssr: false });

export default function ClubSearch({ initialClubs = [] }: ClubSearchProps) {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginOpen, setLoginOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [clubs, setClubs] = useState<Club[]>(initialClubs);

  const supabase: SupabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null));
  }, []);

  const filteredAllClubs = useMemo(() => {
    const searchTerm = search.toLowerCase().trim();
    return clubs.filter((club) => {
      const name = club.name.toLowerCase().trim();
      const cityName = club.city.toLowerCase().trim();
      const countryName = club.country.toLowerCase().trim();

      const matchText =
        name.includes(searchTerm) ||
        cityName.includes(searchTerm) ||
        countryName.includes(searchTerm);

      const matchCountry = country ? club.country === country : true;
      const matchCity = city ? club.city === city : true;

      return matchText && matchCountry && matchCity;
    });
  }, [search, country, city, clubs]);

  const filteredClubs = useMemo(() => {
    const sorted = [...filteredAllClubs].sort(
      (a, b) => (b.rating ?? 0) - (a.rating ?? 0)
    );
    if (!search && !country && !city) return sorted.slice(0, 100);
    return sorted;
  }, [filteredAllClubs, search, country, city]);

  const filteredCountryCount = useMemo(
    () => new Set(filteredClubs.map((c) => c.country)).size,
    [filteredClubs]
  );

  const countries = useMemo(
    () => Array.from(new Set(clubs.map((c) => c.country))).sort(),
    [clubs]
  );

  const cities = useMemo(() => {
    const clubsToUse = country ? clubs.filter((c) => c.country === country) : clubs;
    return Array.from(new Set(clubsToUse.map((c) => c.city))).sort();
  }, [clubs, country]);

  const ClubCard = ({ club }: { club: Club }) => (
    <div className="club-card" onClick={() => setSelectedClub(club)}>
      {club.logo_url && <img src={club.logo_url} alt={club.name} className="club-logo" />}
      <h3>{club.name}</h3>
      <p>{club.city}, {club.country}</p>
    </div>
  );

 const ClubOverlay = ({ club, onClose }: { club: Club; onClose: () => void }) => {
  const [rating, setRating] = useState<number>(club.rating || 0);
  const [scale, setScale] = useState(0.8);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setScale(1), 10);
    return () => clearTimeout(timeout);
  }, []);

  const handleClose = () => {
    setClosing(true);
    setScale(0.8);
    setTimeout(onClose, 300);
  };

  const handleRating = async (value: number) => {
    if (!user) {
      toast.error("Bitte zuerst einloggen.");
      return;
    }

    if (rating === value) {
      toast("Diese Bewertung ist bereits gesetzt.");
      return;
    }

    try {
      const { error } = await supabase.rpc("insert_rating", {
        p_club: Number(club.id),
        p_rating: Number(value),
      });

      if (error) {
        // Supabase kann leeres error-Objekt liefern, daher zusätzliche Infos ausgeben
        console.error("RPC Insert Error:", error.code, error.message, error.details);

        // Unique-Constraint prüfen (User hat schon bewertet)
        if (
          error.code === "23505" || // Postgres Unique Violation
          (error.message && error.message.includes("duplicate key"))
        ) {
          toast.error("Du hast diesen Club bereits bewertet.");
        } else {
          toast.error(`Fehler beim Speichern der Bewertung: ${error.message ?? "Unbekannt"}`);
        }
        return;
      }

      // UI sofort aktualisieren
      setRating(value);
      setClubs((prev) =>
        prev.map((c) => (c.id === club.id ? { ...c, rating: value } : c))
      );
      toast.success("Bewertung erfolgreich gespeichert!");
    } catch (err) {
      console.error("RPC Insert Error (JS):", err);
      toast.error("Fehler beim Speichern der Bewertung (JS-Fehler).");
    }
  };

  const getStarClass = (index: number) =>
    rating >= index ? "star active" : rating >= index - 0.5 ? "star half" : "star";

  return (
    <div
      className={`overlay-backdrop ${closing ? "fadeOut" : ""}`}
      onClick={handleClose}
    >
      <div
        className="overlay-content"
        onClick={(e) => e.stopPropagation()}
        style={{ transform: `scale(${scale})`, transition: "transform 0.3s ease" }}
      >
        <button className="overlay-close" onClick={handleClose}>✕</button>
        {club.logo_url && <img src={club.logo_url} alt={club.name} className="club-logo-large" />}
        <h2>{club.name}</h2>
        <p>{club.city}, {club.country}</p>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} onClick={() => handleRating(i)} className={getStarClass(i)}>★</span>
          ))}
          <span style={{ marginLeft: 6, fontSize: "1rem", color: "#555" }}>{rating.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};


  const firstClubWithCoords = filteredClubs.find(
    (c) => typeof c.lat === "number" && typeof c.lon === "number"
  );
  const mapCenter: [number, number] = firstClubWithCoords
    ? [firstClubWithCoords.lat!, firstClubWithCoords.lon!]
    : [0, 0];

  return (
    <div className="club-search-container">
      <Toaster position="top-center" />
      <div className="main-content">
        <div className="login-inline-container">
          <button className="btn login-btn" onClick={() => setLoginOpen(prev => !prev)}>
            {user ? `Eingeloggt als ${user.email} ▾` : "Login / Registrierung ▾"}
          </button>

          {loginOpen && (
            <div className="login-inline-panel">
              {user ? (
                <button
                  className="btn logout-btn"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    setUser(null);
                    setLoginOpen(false);
                  }}
                >
                  Logout
                </button>
              ) : (
                <LoginModal
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  onClose={() => setLoginOpen(false)}
                  setUser={setUser}
                  supabase={supabase}
                />
              )}
            </div>
          )}
        </div>

        <div className="filters">
          <input
            type="text"
            placeholder={
              !search && !country && !city
                ? "aktuell werden die 100 'besten' Clubs angezeigt..."
                : "Alle passenden Clubs werden angezeigt..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="">Alle Länder</option>
            {countries.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">Alle Städte</option>
            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <h3>
          (Anzahl 'Suche/Filter' Clubs: {filteredClubs.length} / Länder: {filteredCountryCount})
        </h3>

        <ClubMap
          clubs={filteredClubs}
          mapCenter={mapCenter}
          onMarkerClick={(club) => setSelectedClub(club)}
        />

        <div className="club-grid">
          {filteredClubs.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>

        {selectedClub && (
          <ClubOverlay club={selectedClub} onClose={() => setSelectedClub(null)} />
        )}
      </div>
    </div>
  );
}
