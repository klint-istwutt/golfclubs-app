import { createClient } from "@supabase/supabase-js";
import ClubSearch from "./ClubSearch";

export default async function ClubsPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: clubs, error } = await supabase.from("clubs").select("*");
  if (error) console.error("Supabase error:", error.message);

  const clubCount = clubs?.length ?? 0;
  const countryCount = clubs
    ? new Set(clubs.map((c) => c.country)).size
    : 0;

  return (
    <main style={{ padding: "24px" }}>
      <h1 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "24px" }}>
        {clubCount} Golfclubs in {countryCount} Ländern
      </h1>
      <ClubSearch initialClubs={clubs || []} />
    </main>
  );
}
