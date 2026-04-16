import { UserRole } from "./enum.type";

export interface User {
  avatar: string | null;
  bio: string | null;
  createdAt: string;
  email: string;
  fullName: string | null;
  id: string;
  isPremium: boolean;
  lastLoginAt: string | null;
  premiumExpiresAt: string | null;
  role: UserRole;
  updatedAt: string;
  username: string | null;
  followers: number;
  following: number;
  totalPlaylists: number;
}
