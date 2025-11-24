// app/api/clubs/options/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Diese ENV muss nur auf dem Server gesetzt sein (Service Role Key)
// - NEXT_PUBLIC_SUPABASE_URL   (public, bereits vorhanden)
// - SUPABASE_SERVICE_ROLE_KEY  (nur serverseitig!)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Supabase URL or Service Role Key missing");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

export async function GET(request: Request) {
  try {
    // Optional: Query params weiterreichen (z. B. filter by country/state/search)
    const url = new URL(request.url);
    const search = url.searchParams.get("search") ?? undefined;
    const country = url.searchParams.get("country") ?? undefined;
    const state = url.searchParams.get("state") ?? undefined;

    // Build base query with optional filters
    // 1) Distinct countries
    let countryQuery = supabase
      .from("clubs")
      .select("country", { count: undefined, head: false });

    if (search) countryQuery = countryQuery.ilike("name", `%${search}%`);
    if (country) countryQuery = countryQuery.eq("country", country);
    if (state) countryQuery = countryQuery.eq("state", state);

    // We only need distinct values — Supabase doesn't have a direct distinct(...) helper in JS client
    // so use RPC or use select distinct via SQL. We'll use from.raw SQL for distinct.
    const { data: countriesData, error: countryErr } = await supabase.rpc(
      // create a tiny SQL function using Postgres builtins via rpc isn't ideal — instead use SQL via from('clubs').select('distinct country')
      // Supabase JS supports .select('country', { count: 'exact' }).maybe; for distinct, use PostgREST raw query:
      // But PostgREST's query for distinct: select=distinct.country
      // Simpler approach: use rpc to run SQL via 'sql' endpoint isn't available. So fallback to selecting all countries and deduping in JS.
      // We'll select country where country is not null
      "get_countries_fallback",
      {}
    ).catch(() => null);

    // The above rpc may not exist; instead do simple select and dedupe in JS:
    const { data: countriesRows, error: countriesError } = await supabase
      .from("clubs")
      .select("country")
      .neq("country", null)
      .limit(10000);

    if (countriesError) throw countriesError;

    const countries = Array.from(
      new Set((countriesRows || []).map((r: any) => (r.country || "").trim()).filter(Boolean))
    ).sort();

    // 2) Distinct states (similar)
    const { data: statesRows, error: statesError } = await supabase
      .from("clubs")
      .select("state")
      .neq("state", null)
      .limit(10000);

    if (statesError) throw statesError;

    const states = Array.from(
      new Set((statesRows || []).map((r: any) => (r.state || "").trim()).filter(Boolean))
    ).sort();

    return NextResponse.json({ countries, states }, { status: 200 });
  } catch (err: any) {
    console.error("Error in /api/clubs/options:", err);
    return NextResponse.json({ countries: [], states: [], error: String(err) }, { status: 500 });
  }
}
