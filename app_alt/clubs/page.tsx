import ClubSearch from "@components/ClubSearch";
import { Club } from "../../types";

export default async function ClubsPage() {
  // Optional: initial clubs vom Server laden
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/clubs`);
  const initialClubs: Club[] = (await res.json()) || [];

  return (
    <div>
      <ClubSearch initialClubs={initialClubs} />
    </div>
  );
}
