import { Database } from "@/lib/supabase/type";

export interface AlbumCard {
  id: string;
  title: string;
  cover_image: string | null;
  is_published: boolean;
  release_date: string;
}

export type AlbumDB = Database["public"]["Tables"]["album"]["Row"];
