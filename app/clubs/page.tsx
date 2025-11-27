

import { createClient } from "@supabase/supabase-js";
import StatsBar from "../../components/StatsBar";
import ClubSearch from "../../components/ClubSearch";
import Link from "next/link";

export default async function ClubsPage({ searchParams }: any) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { count: clubCount } = await supabase
    .from("clubs")
    .select("*", { count: "exact", head: true });

  const { data: countriesData } = await supabase
    .from("clubs")
    .select("country")
    .neq("country", null);

  const countryCount = new Set(countriesData.map(c => c.country)).size;

  return (
    <main>
      <StatsBar clubCount={clubCount ?? 0} countryCount={countryCount} />

      <div className="max-w-6xl mx-auto px-4 mt-6">
        <ClubSearch />
      </div>


    </main>
  );
}
