// app/api/clubs/options/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Server-side Supabase Service Role Key
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
    const url = new URL(request.url);
    const search = url.searchParams.get("search") ?? undefined;
    const country = url.searchParams.get("country") ?? undefined;
    const state = url.searchParams.get("state") ?? undefined;

    // ------------------------
    // 1) Distinct countries
    // ------------------------
    let countryQuery = supabase.from("clubs").select("country").neq("country", null);

    if (search) countryQuery = countryQuery.ilike("name", `%${search}%`);
    if (country) countryQuery = countryQuery.eq("country", country);
    if (state) countryQuery = countryQuery.eq("state", state);

    const { data: countriesRows, error: countriesError } = await countryQuery;
    if (countriesError) throw countriesError;

    const countries = Array.from(
      new Set(
        (countriesRows || []).map((r: any) => (r.country || "").trim()).filter(Boolean)
      )
    ).sort();

    // ------------------------
    // 2) Distinct states
    // ------------------------
    let stateQuery = supabase.from("clubs").select("state").neq("state", null);
    if (search) stateQuery = stateQuery.ilike("name", `%${search}%`);
    if (country) stateQuery = stateQuery.eq("country", country);
    if (state) stateQuery = stateQuery.eq("state", state);

    const { data: statesRows, error: statesError } = await stateQuery;
    if (statesError) throw statesError;

    const states = Array.from(
      new Set(
        (statesRows || []).map((r: any) => (r.state || "").trim()).filter(Boolean)
      )
    ).sort();

    return NextResponse.json({ countries, states }, { status: 200 });
  } catch (err: any) {
    console.error("Error in /api/clubs/options:", err);
    return NextResponse.json({ countries: [], states: [], error: String(err) }, { status: 500 });
  }
}
