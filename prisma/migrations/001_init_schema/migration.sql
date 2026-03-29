-- Create enum types
CREATE TYPE "UserRole" AS ENUM ('USER', 'ARTIST', 'ADMIN');
CREATE TYPE "PlaylistPrivacy" AS ENUM ('PUBLIC', 'PRIVATE', 'COLLABORATIVE');
CREATE TYPE "StreamingQuality" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'LOSSLESS');
CREATE TYPE "ArtistStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- Create users table
CREATE TABLE "User" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" TEXT UNIQUE NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "username" TEXT UNIQUE NOT NULL,
  "role" "UserRole" NOT NULL DEFAULT 'USER',
  "profileImage" TEXT,
  "bio" TEXT,
  "isEmailVerified" BOOLEAN DEFAULT false,
  "isPremium" BOOLEAN DEFAULT false,
  "premiumEndDate" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create artist table
CREATE TABLE "Artist" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "artistName" TEXT UNIQUE NOT NULL,
  "bio" TEXT,
  "profileImage" TEXT,
  "bannerImage" TEXT,
  "status" "ArtistStatus" NOT NULL DEFAULT 'PENDING',
  "monthlyListeners" INTEGER DEFAULT 0,
  "isVerified" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create genre table
CREATE TABLE "Genre" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT UNIQUE NOT NULL,
  "description" TEXT,
  "icon" TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create album table
CREATE TABLE "Album" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "artistId" UUID NOT NULL REFERENCES "Artist"("id") ON DELETE CASCADE,
  "coverImage" TEXT,
  "releaseDate" DATE NOT NULL,
  "description" TEXT,
  "totalTracks" INTEGER DEFAULT 0,
  "isExplicit" BOOLEAN DEFAULT false,
  "genreId" UUID REFERENCES "Genre"("id"),
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create track table
CREATE TABLE "Track" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "artistId" UUID NOT NULL REFERENCES "Artist"("id") ON DELETE CASCADE,
  "albumId" UUID REFERENCES "Album"("id") ON DELETE CASCADE,
  "duration" INTEGER NOT NULL,
  "audioUrl" TEXT NOT NULL,
  "audioFileSize" BIGINT,
  "previewUrl" TEXT,
  "lyrics" TEXT,
  "lyricsUrl" TEXT,
  "isExplicit" BOOLEAN DEFAULT false,
  "isActive" BOOLEAN DEFAULT true,
  "genreId" UUID REFERENCES "Genre"("id"),
  "playCount" BIGINT DEFAULT 0,
  "uploadedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user favorites table
CREATE TABLE "UserFavorite" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "trackId" UUID NOT NULL REFERENCES "Track"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("userId", "trackId")
);

-- Create playlist table
CREATE TABLE "Playlist" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "coverImage" TEXT,
  "privacy" "PlaylistPrivacy" NOT NULL DEFAULT 'PRIVATE',
  "totalTracks" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create playlist tracks table
CREATE TABLE "PlaylistTrack" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "playlistId" UUID NOT NULL REFERENCES "Playlist"("id") ON DELETE CASCADE,
  "trackId" UUID NOT NULL REFERENCES "Track"("id") ON DELETE CASCADE,
  "addedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("playlistId", "trackId")
);

-- Create user followers table
CREATE TABLE "Follow" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "followerId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "followingId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("followerId", "followingId"),
  CHECK ("followerId" != "followingId")
);

-- Create listening history table
CREATE TABLE "ListeningHistory" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "trackId" UUID NOT NULL REFERENCES "Track"("id") ON DELETE CASCADE,
  "listenedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "progress" INTEGER DEFAULT 0
);

-- Create streaming analytics table
CREATE TABLE "StreamingAnalytics" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "trackId" UUID NOT NULL REFERENCES "Track"("id") ON DELETE CASCADE,
  "userId" UUID REFERENCES "User"("id") ON DELETE SET NULL,
  "quality" "StreamingQuality" NOT NULL DEFAULT 'HIGH',
  "streamedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "duration" INTEGER
);

-- Create artist request table (for requesting artist status)
CREATE TABLE "ArtistRequest" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "artistName" TEXT NOT NULL,
  "bio" TEXT,
  "status" "ArtistStatus" NOT NULL DEFAULT 'PENDING',
  "requestedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "reviewedAt" TIMESTAMP,
  "reviewedBy" UUID REFERENCES "User"("id") ON DELETE SET NULL,
  "rejectionReason" TEXT
);

-- Create track rating/review table
CREATE TABLE "TrackRating" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "trackId" UUID NOT NULL REFERENCES "Track"("id") ON DELETE CASCADE,
  "rating" INTEGER CHECK (rating >= 1 AND rating <= 5),
  "review" TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("userId", "trackId")
);

-- Create playlist collaboration table
CREATE TABLE "PlaylistCollaborator" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "playlistId" UUID NOT NULL REFERENCES "Playlist"("id") ON DELETE CASCADE,
  "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "addedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("playlistId", "userId")
);

-- Create user activity/notification table
CREATE TABLE "UserActivity" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "activityType" TEXT NOT NULL,
  "relatedUserId" UUID REFERENCES "User"("id") ON DELETE SET NULL,
  "relatedTrackId" UUID REFERENCES "Track"("id") ON DELETE SET NULL,
  "description" TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create admin audit log table
CREATE TABLE "AdminAuditLog" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "adminId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "action" TEXT NOT NULL,
  "entityType" TEXT,
  "entityId" TEXT,
  "changes" JSONB,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create recommendation table
CREATE TABLE "TrackRecommendation" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "trackId" UUID NOT NULL REFERENCES "Track"("id") ON DELETE CASCADE,
  "score" NUMERIC(10, 4),
  "reason" TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "User_username_idx" ON "User"("username");
CREATE INDEX "Artist_userId_idx" ON "Artist"("userId");
CREATE INDEX "Album_artistId_idx" ON "Album"("artistId");
CREATE INDEX "Album_genreId_idx" ON "Album"("genreId");
CREATE INDEX "Track_artistId_idx" ON "Track"("artistId");
CREATE INDEX "Track_albumId_idx" ON "Track"("albumId");
CREATE INDEX "Track_genreId_idx" ON "Track"("genreId");
CREATE INDEX "UserFavorite_userId_idx" ON "UserFavorite"("userId");
CREATE INDEX "UserFavorite_trackId_idx" ON "UserFavorite"("trackId");
CREATE INDEX "Playlist_userId_idx" ON "Playlist"("userId");
CREATE INDEX "PlaylistTrack_playlistId_idx" ON "PlaylistTrack"("playlistId");
CREATE INDEX "PlaylistTrack_trackId_idx" ON "PlaylistTrack"("trackId");
CREATE INDEX "Follow_followerId_idx" ON "Follow"("followerId");
CREATE INDEX "Follow_followingId_idx" ON "Follow"("followingId");
CREATE INDEX "ListeningHistory_userId_idx" ON "ListeningHistory"("userId");
CREATE INDEX "ListeningHistory_trackId_idx" ON "ListeningHistory"("trackId");
CREATE INDEX "StreamingAnalytics_trackId_idx" ON "StreamingAnalytics"("trackId");
CREATE INDEX "StreamingAnalytics_userId_idx" ON "StreamingAnalytics"("userId");
CREATE INDEX "ArtistRequest_userId_idx" ON "ArtistRequest"("userId");
CREATE INDEX "TrackRating_userId_idx" ON "TrackRating"("userId");
CREATE INDEX "TrackRating_trackId_idx" ON "TrackRating"("trackId");
CREATE INDEX "PlaylistCollaborator_playlistId_idx" ON "PlaylistCollaborator"("playlistId");
CREATE INDEX "PlaylistCollaborator_userId_idx" ON "PlaylistCollaborator"("userId");
CREATE INDEX "UserActivity_userId_idx" ON "UserActivity"("userId");
CREATE INDEX "AdminAuditLog_adminId_idx" ON "AdminAuditLog"("adminId");
CREATE INDEX "TrackRecommendation_userId_idx" ON "TrackRecommendation"("userId");
CREATE INDEX "TrackRecommendation_trackId_idx" ON "TrackRecommendation"("trackId");
