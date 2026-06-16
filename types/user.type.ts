import { UserRole } from "./enum.type";

export type SubscriptionStatus =
  | "active"
  | "cancelling"
  | "past_due"
  | "inactive";

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName: string | null;
  role: UserRole;

  avatar: string | null;
  bio: string | null;

  isPremium: boolean;
  subscriptionStatus: SubscriptionStatus;
  premiumExpiresAt: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;

  followers: number | null;
  following: number | null;
  totalPlaylists: number | null;

  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserAuth {
  id: string;
  email: string;
  userMetadata: UserMetadata;
}

export interface UserMetadata {
  // Provider Information
  iss: string;
  sub: string;
  provider_id: string;

  // Profile Information
  name: string;
  full_name: string;
  email: string;
  picture: string;
  avatar_url: string;

  // Verification Status
  email_verified: boolean;
  phone_verified: boolean;
}
