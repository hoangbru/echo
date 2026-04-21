import { Database } from "@/lib/supabase/type";

export type UserDB = Database["public"]["Tables"]["user"]["Row"];
