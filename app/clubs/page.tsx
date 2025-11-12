import { createClient } from "@supabase/supabase-js";
import ClubSearch from "./ClubSearch";
import Link from "next/link"; // Für Next.js Links

export default async function ClubsPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1️⃣ Gesamte Anzahl der Clubs abfragen
  const { count: clubCount, error: countError } = await supabase
    .from("clubs")
    .select("*", { count: "exact", head: true });

  if (countError) console.error("Supabase count error:", countError.message);

  // 2️⃣ Alle Zeilen laden (falls benötigt, z.B. für ClubSearch)
  const { data: clubs, error } = await supabase.from("clubs").select("*");
  if (error) console.error("Supabase data error:", error.message);

  const countryCount = clubs
    ? new Set(clubs.map((c) => c.country)).size
    : 0;

  return (
    <main style={{ padding: "5px" }}>
      <h1
        style={{
          textAlign: "center",
          fontSize: "1.5rem",
          marginBottom: "24px",
        }}
      >
        {clubCount} Golfclubs in {countryCount} Ländern
      </h1>

      <ClubSearch initialClubs={clubs || []} />

      {/* Footer mit Links */}
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
