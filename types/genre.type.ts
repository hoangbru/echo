import { Database } from "@/lib/supabase/type";

export type GenreDB = Database["public"]["Tables"]["genre"]["Row"];
