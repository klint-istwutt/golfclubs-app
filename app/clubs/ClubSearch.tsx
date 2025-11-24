"use client";

import { useState, useEffect } from "react";
import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
import dynamic from "next/dynamic";
import { LoginModal } from "./LoginModal";
import toast, { Toaster } from "react-hot-toast";
import "./ClubSearch.css";

interface Club {
  id: number;
  name: string;
  city?: string;
  state?: string;
  country?: string;
  address?: string;
  zip?: string;
  website?: string;
  email?: string;
  phone?: string;
  holes?: number;
  logo_url?: string;
  lat?: number;
  lon?: number;
  avg_rating?: number;
  rating_count?: number;
}

interface ClubSearchProps {
  initialClubs?: Club[];
  initialSearch?: string;
  initialCountry?: string;
  initialState?: string;
}

const ClubMap = dynamic(() => import("./ClubMap"), { ssr: false });

export default function ClubSearch({
  initialClubs = [],
  initialSearch = "",
  initialCountry = "",
  initialState = "",
}: ClubSearchProps) {
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState(initialSearch);
  const [country, setCountry] = useState(initialCountry);
  const [state, setState] = useState(initialState);
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

  // Client-only Flag + User laden
  useEffect(() => {
    setMounted(true);
    supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null));
  }, []);

  // ---------------------------
  // Suche/Filter
  // ---------------------------
  useEffect(() => {
    const fetchFilteredClubs = async () => {
      // Nur aktiv, wenn Filter gesetzt
      if (!search && !country && !state) return;

      try {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (country) params.append("country", country);
        if (state) params.append("state", state);

        const res = await fetch(`/api/clubs?${params.toString()}`);
        if (!res.ok) throw new Error("Fehler beim Laden der Clubs");
        const data = await res.json();
        setClubs(data);
      } catch (err) {
        console.error(err);
        toast.error("Fehler beim Laden der Clubs");
      }
    };

    fetchFilteredClubs();
  }, [search, country, state]);

  // ---------------------------
  // Filteroptionen für Dropdowns
  // ---------------------------
  const currentClubs = (search || country || state) ? clubs : initialClubs;

  const countries = Array.from(new Set(currentClubs.map(c => c.country))).sort();
  const states = Array.from(
    new Set(
      currentClubs
        .filter(c => !country || c.country === country)
        .map(c => c.state ?? "")
    )
  ).sort();

  // Map Center
  const firstClubWithCoords = currentClubs.find(c => typeof c.lat === "number" && typeof c.lon === "number");
  const mapCenter: [number, number] = firstClubWithCoords ? [firstClubWithCoords.lat!, firstClubWithCoords.lon!] : [0, 0];

  // ---------------------------
  // Club Card
  // ---------------------------
  const ClubCard = ({ club }: { club: Club }) => (
    <div className="club-card" onClick={() => setSelectedClub(club)}>
      {club.logo_url && <img src={club.logo_url} alt={club.name} className="club-logo" />}
      <h3>{club.name}</h3>
      <p>{club.city}, {club.state ? `${club.state}, ` : ""}{club.country}</p>
    </div>
  );

  // ---------------------------
  // Overlay
  // ---------------------------
  const ClubOverlay = ({ club, onClose }: { club: Club; onClose: () => void }) => {
    const [rating, setRating] = useState<number>(club.avg_rating || 0);
    const [scale, setScale] = useState(0.8);
    const [closing, setClosing] = useState(false);

    useEffect(() => {
      const t = setTimeout(() => setScale(1), 10);
      return () => clearTimeout(t);
    }, []);

    const handleClose = () => {
      setClosing(true);
      setScale(0.8);
      setTimeout(onClose, 300);
    };

    const handleRating = async (value: number) => {
      if (!user) return toast.error("Bitte zuerst einloggen.");
      if (rating === value) return toast("Diese Bewertung ist bereits gesetzt.");

      try {
        const { error } = await supabase.rpc("insert_rating", {
          p_club: Number(club.id),
          p_rating: Number(value)
        });
        if (error) {
          console.error("RPC Insert Error:", error);
          if (error.code === "23505" || (error.message && error.message.includes("duplicate key"))) {
            return toast.error("Du hast diesen Club bereits bewertet.");
          } else return toast.error(`Fehler: ${error.message ?? "Unbekannt"}`);
        }
        setRating(value);
        setClubs(prev => prev.map(c => (c.id === club.id ? { ...c, avg_rating: value } : c)));
        toast.success("Bewertung erfolgreich gespeichert!");
      } catch (err) {
        console.error("RPC JS Error:", err);
        toast.error("Fehler beim Speichern (JS).");
      }
    };

    const getStarClass = (i: number) => rating >= i ? "star active" : rating >= i - 0.5 ? "star half" : "star";

    return (
      <div className={`overlay-backdrop ${closing ? "fadeOut" : ""}`} onClick={handleClose}>
        <div className="overlay-content" onClick={e => e.stopPropagation()} style={{ transform: `scale(${scale})`, transition: "transform 0.3s ease" }}>
          <button className="overlay-close" onClick={handleClose}>✕</button>
          {club.logo_url && <img src={club.logo_url} alt={club.name} className="club-logo-large" />}
          <h2>{club.name}</h2>
          <p>{club.city}{club.state ? `, ${club.state}` : ""}, {club.country}</p>

          {club.address && <p><strong>Address:</strong> {club.address}{club.zip ? `, ${club.zip}` : ""}</p>}
          {club.website && <p><strong>Website:</strong> <a href={club.website} target="_blank" rel="noopener noreferrer">{club.website}</a></p>}
          {club.email && <p><strong>Email:</strong> <a href={`mailto:${club.email}`}>{club.email}</a></p>}
          {club.phone && <p><strong>Phone:</strong> {club.phone}</p>}
          {club.holes && <p><strong>Holes:</strong> {club.holes}</p>}

          <div className="stars">
            {[1, 2, 3, 4, 5].map(i => (
              <span key={i} onClick={() => handleRating(i)} className={getStarClass(i)}>★</span>
            ))}
            <span style={{ marginLeft: 6, fontSize: "1rem", color: "#555" }}>{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    );
  };

  if (!mounted) return null;

  return (
    <div className="club-search-container">
      <Toaster position="top-center" />
      <div className="main-content">

        {/* Login */}
        <div className="login-inline-container">
          <button className="btn login-btn" onClick={() => setLoginOpen(prev => !prev)}>
            {user ? `Eingeloggt als ${user.email} ▾` : "login / register ▾"}
          </button>
          {loginOpen && (
            <div className="login-inline-panel">
              {user ? (
                <button className="btn logout-btn" onClick={async () => { await supabase.auth.signOut(); setUser(null); setLoginOpen(false); }}>Logout</button>
              ) : (
                <LoginModal email={email} setEmail={setEmail} password={password} setPassword={setPassword} onClose={() => setLoginOpen(false)} setUser={setUser} supabase={supabase} />
              )}
            </div>
          )}
        </div>

        {/* Filter */}
        <div className="filters">
          <input type="text" placeholder={!search && !country && !state ? "search by name" : "matching clubs are displayed..."} value={search} onChange={e => setSearch(e.target.value)} />
          <select value={country} onChange={e => setCountry(e.target.value)}>
            <option value="">select country</option>
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={state} onChange={e => setState(e.target.value)}>
            <option value="">select state</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
  <h3 style={{ margin: 0 }}>
    {`Showing ${currentClubs.length} ${currentClubs.length === 1 ? "club" : "clubs"} across ${countries.length} ${countries.length === 1 ? "country" : "countries:"}`}
  </h3>

  {(search || country || state) && (
    <button
      className="reset-filters-btn"
      style={{
        padding: "6px 12px",
        fontSize: "0.9rem",
        borderRadius: "6px",
        border: "1px solid #ccc",
        backgroundColor: "#f5f5f5",
        cursor: "pointer"
      }}
      onClick={() => {
        setSearch("");
        setCountry("");
        setState("");
        setClubs(initialClubs); // Top-100 wieder anzeigen
      }}
    >
      Reset Filters
    </button>
  )}
</div>



        {/* Leaflet Map */}
        <ClubMap clubs={currentClubs} mapCenter={mapCenter} onMarkerClick={c => setSelectedClub(c)} />

        {/* Club Grid */}
        <div className="club-grid">{currentClubs.map(club => <ClubCard key={club.id} club={club} />)}</div>

        {/* Overlay */}
        {selectedClub && <ClubOverlay club={selectedClub} onClose={() => setSelectedClub(null)} />}

      </div>
    </div>
  );
}
