"use client";

interface Club {
  id: number;
  name: string;
  city: string;
  country: string;
  logo_url?: string;
  rating?: string | number | null;
}

export default function ClubCard({ club }: { club: Club }) {
  const rating = Number(club.rating) || 0;

  return (
    <div className="club-card" style={{ minHeight: 300 }}>
      {club.logo_url && <img src={club.logo_url} alt={club.name} className="club-logo" />}
      <div className="club-card-content">
        <h2>{club.name}</h2>
        <p>{club.city}, {club.country}</p>
        {/* Debug-Ausgabe */}
        <div style={{ background: "#eee", padding: "4px", borderRadius: "4px", marginTop: "6px" }}>
          Rating: {rating.toFixed(1)}
        </div>
      </div>
    </div>
  );
}
