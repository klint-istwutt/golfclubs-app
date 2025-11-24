"use client";

interface Club {
  id: number;
  name: string;
  city: string;
  state?: string;
  country: string;
  address?: string;
  zip?: string;
  website?: string;
  email?: string;
  phone?: string;
  holes?: string; // Textfeld
  logo_url?: string;
  rating?: string | number | null;
}

export default function ClubCard({ club }: { club: Club }) {
  const rating = Number(club.rating) || 0;

  return (
    <div className="club-card">
      {club.logo_url && (
        <img src={club.logo_url} alt={club.name} className="club-logo" />
      )}

      <div className="club-card-content">
        <h2>{club.name}</h2>
        <p>
          {club.city}
          {club.state ? `, ${club.state}` : ""}, {club.country}
        </p>

        {club.address && (
          <p>
            <strong>Address:</strong> {club.address}
            {club.zip ? `, ${club.zip}` : ""}
          </p>
        )}

        {club.website && (
          <p>
            <strong>Website:</strong>{" "}
            <a href={club.website} target="_blank" rel="noopener noreferrer">
              {club.website}
            </a>
          </p>
        )}

        {club.email && (
          <p>
            <strong>Email:</strong>{" "}
            <a href={`mailto:${club.email}`}>{club.email}</a>
          </p>
        )}

        {club.phone && (
          <p>
            <strong>Phone:</strong> {club.phone}
          </p>
        )}

        {club.holes && (
          <p>
            <strong>Holes:</strong> {club.holes}
          </p>
        )}

        <div
          style={{
            marginTop: "6px",
            background: "#eee",
            padding: "4px",
            borderRadius: "4px",
          }}
        >
          Rating: {rating.toFixed(1)} ★
        </div>
      </div>
    </div>
  );
}
