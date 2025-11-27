import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  try {
    const { search, country, state } = Object.fromEntries(
      new URL(req.url).searchParams
    );

    let query = supabase
      .from("clubs")
      .select(`
        id,
        name,
        city,
        state,
        country,
        address,
        zip,
        website,
        email,
        phone,
        holes,
        logo_url,
        rating,
        lat,
        lon
      `);

    if (search && search.trim() !== "") {
      const term = search.trim();
      query = query.or(`name.ilike.%${term}%,state.ilike.%${term}%,country.ilike.%${term}%`);
    }

    if (country && country.trim() !== "") {
      query = query.eq("country", country);
    }

    if (state && state.trim() !== "") {
      query = query.eq("state", state);
    }

    const { data, error } = await query;

    console.log(
      "[Clubs API]",
      JSON.stringify({ search, country, state, resultCount: data?.length || 0 })
    );

    if (error) {
      console.error("[Clubs API] Fehler:", error.message);
      return new Response(JSON.stringify([]), { status: 200 });
    }

    return new Response(JSON.stringify(Array.isArray(data) ? data : []), {
      status: 200,
    });
  } catch (err) {
    console.error("[Clubs API] Unerwarteter Fehler:", err);
    return new Response(JSON.stringify([]), { status: 200 });
  }
}
