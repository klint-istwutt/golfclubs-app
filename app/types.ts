// app/types.ts
export interface Club {
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
