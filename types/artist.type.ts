import { Database } from "@/lib/supabase/type";

export type ArtistDB = Database["public"]["Tables"]["artist"]["Row"];
