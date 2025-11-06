"use client";

import { useState, useMemo, useEffect } from "react";
import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
import "./ClubSearch.css";

interface Club {
  id: number;
  name: string;
  city: string;
  country: string;
  logo_url: string;
  rating?: number;
}

interface ClubSearchProps {
  initialClubs?: Club[];
}

export default function ClubSearch({ initialClubs = [] }: ClubSearchProps) {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const supabase: SupabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Prüfe Login-Status
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null));
  }, [supabase]);

  // Login
  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert(error.message);
    else setUser(data.user);
  };

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Filterlogik
  const filteredClubs = useMemo(() => {
    return initialClubs.filter((club) => {
      const matchText =
        club.name.toLowerCase().includes(search.toLowerCase()) ||
        club.city.toLowerCase().includes(search.toLowerCase()) ||
        club.country.toLowerCase().includes(search.toLowerCase());
      const matchCountry = country ? club.country === country : true;
      const matchCity = city ? club.city === city : true;
      return matchText && matchCountry && matchCity;
    });
  }, [search, country, city, initialClubs]);

  const countries = Array.from(new Set(initialClubs.map((c) => c.country))).sort();
  const cities = Array.from(new Set(initialClubs.map((c) => c.city))).sort();

  const filteredCountryCount = useMemo(() => {
    return new Set(filteredClubs.map((c) => c.country)).size;
  }, [filteredClubs]);

  // ClubCard-Komponente (integriert)
  const ClubCard = ({ club }: { club: Club }) => {
    const [rating, setRating] = useState<number>(club.rating || 0);

    const handleRating = async (value: number) => {
      if (!user) {
        alert("Bitte einloggen, um zu bewerten!");
        return;
      }
      setRating(value);
      const { error } = await supabase
        .from("clubs")
        .update({ rating: value })
        .eq("id", club.id);
      if (error) alert("Fehler beim Speichern der Bewertung: " + error.message);
    };

    return (
      <div className="club-card">
        <img src={club.logo_url} alt={club.name} className="club-logo" />
        <h3>{club.name}</h3>
        <p>
          {club.city}, {club.country}
        </p>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              onClick={() => handleRating(i)}
              className={`star ${i <= rating ? "active" : ""}`}
            >
              ★
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="club-search-container">
      {/* Sidebar */}
      <aside className="sidebar">
        {user ? (
          <div>
            <p className="logged-in-as">Eingeloggt als:</p>
            <p className="user-email">{user.email}</p>
            <button onClick={handleLogout} className="btn logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <div>
            <h3>Login</h3>
            <input
              type="email"
              placeholder="E-Mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin} className="btn login-btn">
              Login
            </button>
          </div>
        )}
      </aside>

      {/* Hauptinhalt */}
      <div className="main-content">
        <div className="filters">
          <input
            type="text"
            placeholder="Suche..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="">Alle Länder</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">Alle Städte</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <h2>
          (Anzahl Clubs: {filteredClubs.length} / Anzahl Länder: {filteredCountryCount} Ländern)
        </h2>

        <div className="club-grid">
          {filteredClubs.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      </div>
    </div>
  );
}
