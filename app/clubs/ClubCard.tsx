"use client";

export default function ClubCard({ club }: { club: any }) {
  return (
    <div className="club-card">
      {club.logo_url && <img src={club.logo_url} alt={club.name} />}
      <div className="club-card-content">
        <h2>{club.name}</h2>
        <p>{club.city}, {club.country}</p>
      </div>
    </div>
  );
}
