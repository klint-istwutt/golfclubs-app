import { createClient } from "@supabase/supabase-js";
import ClubSearch from "./ClubSearch";
import Link from "next/link";

interface ClubsQuery {
  search?: string;
  country?: string;
  state?: string;
}

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

export default async function ClubsPage({ searchParams }: { searchParams: ClubsQuery }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { search = "", country = "", state = "" } = searchParams || {};

  // ------------------------------
  // Top 100 Clubs beim Laden
  // ------------------------------
  const { data: initialClubs, error: topError } = await supabase
    .from("top_100_clubs")
    .select("*");

  if (topError) console.error("Supabase fetch error:", topError.message ?? topError);

  // ------------------------------
  // Optional: Gesamtzahl Clubs und Länder
  // ------------------------------
  const countryCount = initialClubs ? new Set(initialClubs.map(c => c.country)).size : 0;

  const { count: clubCount, error: countError } = await supabase
    .from("clubs")
    .select("*", { count: "exact", head: true });
  if (countError) console.error("Supabase count error:", countError?.message ?? countError);

  return (
    <main style={{ padding: "5px" }}>
      <h1
        style={{
          textAlign: "center",
          fontSize: "1.5rem",
          marginBottom: "24px",
        }}
      >
        {clubCount} Clubs in {countryCount} Countries
      </h1>

      <ClubSearch
        initialClubs={initialClubs || []}
        initialSearch={search}
        initialCountry={country}
        initialState={state}
      />

      <footer
        style={{
          marginTop: "40px",
          textAlign: "center",
          fontSize: "0.9rem",
          color: "#555",
        }}
      >
        <Link href="/impressum" style={{ marginRight: "15px" }}>
          Impressum
        </Link>
        <Link href="/datenschutz">Datenschutzerklärung</Link>
      </footer>
    </main>
  );
}
