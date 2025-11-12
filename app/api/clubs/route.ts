import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  try {
    const { search, country, city } = Object.fromEntries(
      new URL(req.url).searchParams
    );

    // 🏗️ Grund-Query
    let query = supabase.from("clubs").select("*");

if (search && search.trim() !== "") {
  const term = search.trim();
  query = query.or(
    `name.ilike."%${term}%",city.ilike."%${term}%",country.ilike."%${term}%"`
  );
}


    // 🌍 Länderfilter
    if (country && country.trim() !== "") {
      query = query.eq("country", country);
    }

    // 🏙 Stadtfilter
    if (city && city.trim() !== "") {
      query = query.eq("city", city);
    }

    // 📦 Anfrage ausführen
    const { data, error } = await query;

    // 🔎 Logging für Debug-Zwecke
    console.log(
      "[Clubs API]",
      JSON.stringify({ search, country, city, resultCount: data?.length || 0 })
    );

    // ❌ Fehlerbehandlung
    if (error) {
      console.error("[Clubs API] Fehler:", error.message);
      return new Response(JSON.stringify([]), { status: 200 }); // leeres Array zurückgeben
    }

    // ✅ Immer ein Array zurückgeben
    return new Response(JSON.stringify(Array.isArray(data) ? data : []), {
      status: 200,
    });
  } catch (err) {
    console.error("[Clubs API] Unerwarteter Fehler:", err);
    return new Response(JSON.stringify([]), { status: 200 });
  }
}
