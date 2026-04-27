import { Database } from "@/lib/supabase/type";

export interface Genre {
  color: string | null;
  createdAt: string;
  description: string | null;
  icon: string | null;
  id: string;
  name: string;
}

export type GenreDB = Database["public"]["Tables"]["genre"]["Row"];
