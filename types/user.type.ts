import { Database } from "@/lib/supabase/type";
import { UserRole } from "./enum.type";

export interface User {
  avatar: string | null;
  bio: string | null;
  createdAt: string;
  email: string;
  followers: number | null;
  following: number | null;
  fullName: string | null;
  id: string;
  isPremium: boolean;
  lastLoginAt: string | null;
  premiumExpiresAt: string | null;
  role: UserRole;
  totalPlaylists: number | null;
  updatedAt: string;
  username: string;
}

export type UserDB = Database["public"]["Tables"]["user"]["Row"];
