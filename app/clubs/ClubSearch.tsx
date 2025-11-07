"use client";

import { useState, useMemo, useEffect } from "react";
import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
import "./ClubSearch.css";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import L from "leaflet";

// --- Typen ---
interface Club {
  id: number;
  name: string;
  city: string;
  country: string;
  logo_url: string;
  rating?: number;
  lat?: number;
  lon?: number;
}

interface ClubSearchProps {
  initialClubs?: Club[];
}

// --- Client-only Leaflet Map Import ---
const ClubMap = dynamic(() => import("./ClubMap"), { ssr: false });

// --- Supabase Setup ---
export default function ClubSearch({ initialClubs = [] }: ClubSearchProps) {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginOpen, setLoginOpen] = useState(false);

  const supabase: SupabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null));
  }, [supabase]);

  // --- Auth-Handler ---
  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else setUser(data.user);
  };
  const handleLogout = async () => { await supabase.auth.signOut(); setUser(null); };
  const handleRegister = async () => { const { error } = await supabase.auth.signUp({ email, password }); if (error) alert(error.message); else alert("Registrierung erfolgreich!"); };
  const handleResetPassword = async () => { if (!email) { alert("Bitte E-Mail-Adresse eingeben!"); return; } const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin }); if (error) alert(error.message); else alert("E-Mail zum Zurücksetzen gesendet!"); };

  // --- Filterung ---
  const filteredAllClubs = useMemo(() => {
    return initialClubs.filter(club => {
      const matchText =
        club.name.toLowerCase().includes(search.toLowerCase()) ||
        club.city.toLowerCase().includes(search.toLowerCase()) ||
        club.country.toLowerCase().includes(search.toLowerCase());
      const matchCountry = country ? club.country === country : true;
      const matchCity = city ? club.city === city : true;
      return matchText && matchCountry && matchCity;
    });
  }, [search, country, city, initialClubs]);

  const filteredClubs = useMemo(() => {
    return [...filteredAllClubs].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 100);
  }, [filteredAllClubs]);

  const filteredCountryCount = useMemo(() => new Set(filteredClubs.map(c => c.country)).size, [filteredClubs]);
  const countries = useMemo(() => Array.from(new Set(initialClubs.map(c => c.country))).sort(), [initialClubs]);
  const cities = useMemo(() => {
    const clubsToUse = country ? initialClubs.filter(c => c.country === country) : initialClubs;
    return Array.from(new Set(clubsToUse.map(c => c.city))).sort();
  }, [initialClubs, country]);

  // --- ClubCard ---
  const ClubCard = ({ club }: { club: Club }) => {
    const [rating, setRating] = useState<number>(club.rating || 0);
    const handleRating = async (value: number) => {
      if (!user) { alert("Bitte einloggen!"); return; }
      setRating(value);
      const { error } = await supabase.from("clubs").update({ rating: value }).eq("id", club.id);
      if (error) alert(error.message);
    };
    const getStarClass = (index: number) => rating >= index ? "star active" : rating >= index - 0.5 ? "star half" : "star";
    return (
      <div className="club-card">
        <img src={club.logo_url} alt={club.name} className="club-logo" />
        <h3>{club.name}</h3>
        <p>{club.city}, {club.country}</p>
        <div className="stars">
          {[1,2,3,4,5].map(i => <span key={i} onClick={() => handleRating(i)} className={getStarClass(i)}>★</span>)}
          <span style={{marginLeft:"6px",fontSize:"0.9rem",color:"#555"}}>{rating.toFixed(1)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="club-search-container">
      <div className="main-content">

        {/* Login */}
        <div className="login-inline-container">
          <div className="login-inline-header" onClick={() => setLoginOpen(prev => !prev)}>
            {user ? <p>Eingeloggt als <strong>{user.email}</strong> ▾</p> : <p>Nicht eingeloggt ▾</p>}
          </div>
          {loginOpen && (
            <div className="login-inline-panel">
              {user ? <button onClick={handleLogout} className="btn logout-btn">Logout</button> : <>
                <input type="email" placeholder="E-Mail" value={email} onChange={e => setEmail(e.target.value)} />
                <input type="password" placeholder="Passwort" value={password} onChange={e => setPassword(e.target.value)} />
                <div className="login-buttons">
                  <button onClick={handleLogin} className="btn login-btn">Login</button>
                  <button onClick={handleRegister} className="btn register-btn">Registrieren</button>
                </div>
                <button onClick={handleResetPassword} className="link-btn">Passwort vergessen?</button>
              </>}
            </div>
          )}
        </div>

        {/* Filter */}
        <div className="filters">
          <input type="text" placeholder="aktuell werden die 100 'besten' Clubs angezeigt..." value={search} onChange={e => setSearch(e.target.value)} />
          <select value={country} onChange={e => setCountry(e.target.value)}>
            <option value="">Alle Länder</option>
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={city} onChange={e => setCity(e.target.value)}>
            <option value="">Alle Städte</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <h3>(Anzahl 'Suche/Filter' Clubs: {filteredClubs.length} / Länder: {filteredCountryCount})</h3>

        {/* Client-only Map */}
        {filteredClubs.some(c => c.lat && c.lon) && <ClubMap clubs={filteredClubs} />}

        {/* Club Grid */}
        <div className="club-grid">
          {filteredClubs.map(club => <ClubCard key={club.id} club={club} />)}
        </div>

      </div>
    </div>
  );
}
