import { Database } from "@/lib/supabase/type";
import { UserRole } from "./enum.type";

export type SubscriptionStatus =
  | "active"
  | "cancelling"
  | "past_due"
  | "inactive";

export interface UserProfile {
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
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  subscriptionStatus: SubscriptionStatus;
  totalPlaylists: number | null;
  updatedAt: string;
  username: string;
}

export interface UserAuth {
  email: string;
  id: string;
  userMetadata: UserMetadata;
}

export interface UserMetadata {
  avatar_url: string;
  email: string;
  email_verified: boolean;
  full_name: string;
  iss: string;
  name: string;
  phone_verified: boolean;
  picture: string;
  provider_id: string;
  sub: string;
}
export type UserDB = Database["public"]["Tables"]["user"]["Row"];
