/*
  Warnings:

  - The primary key for the `AdminAuditLog` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `entityId` on the `AdminAuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `entityType` on the `AdminAuditLog` table. All the data in the column will be lost.
  - The primary key for the `Album` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `isExplicit` on the `Album` table. All the data in the column will be lost.
  - The primary key for the `ArtistRequest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `artistName` on the `ArtistRequest` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `ArtistRequest` table. All the data in the column will be lost.
  - You are about to drop the column `rejectionReason` on the `ArtistRequest` table. All the data in the column will be lost.
  - You are about to drop the column `requestedAt` on the `ArtistRequest` table. All the data in the column will be lost.
  - The `status` column on the `ArtistRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Follow` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Genre` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Playlist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `privacy` on the `Playlist` table. All the data in the column will be lost.
  - The primary key for the `PlaylistCollaborator` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Track` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `audioFileSize` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the column `lyricsUrl` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the column `playCount` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the column `uploadedAt` on the `Track` table. All the data in the column will be lost.
  - The primary key for the `TrackRecommendation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `TrackRecommendation` table. All the data in the column will be lost.
  - You are about to alter the column `score` on the `TrackRecommendation` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `DoublePrecision`.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `isEmailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `premiumEndDate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profileImage` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Artist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ListeningHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlaylistTrack` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StreamingAnalytics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TrackRating` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserActivity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserFavorite` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[trackId,relatedTrackId]` on the table `TrackRecommendation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `targetId` to the `AdminAuditLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetType` to the `AdminAuditLog` table without a default value. This is not possible if the table is not empty.
  - Made the column `createdAt` on table `AdminAuditLog` required. This step will fail if there are existing NULL values in that column.
  - Made the column `totalTracks` on table `Album` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Album` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Album` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `ArtistRequest` table without a default value. This is not possible if the table is not empty.
  - Made the column `createdAt` on table `Follow` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Genre` required. This step will fail if there are existing NULL values in that column.
  - Made the column `totalTracks` on table `Playlist` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Playlist` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Playlist` required. This step will fail if there are existing NULL values in that column.
  - Made the column `addedAt` on table `PlaylistCollaborator` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isExplicit` on table `Track` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Track` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Track` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `relatedTrackId` to the `TrackRecommendation` table without a default value. This is not possible if the table is not empty.
  - Made the column `score` on table `TrackRecommendation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `TrackRecommendation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isPremium` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ArtistRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "RepeatMode" AS ENUM ('OFF', 'ALL', 'ONE');

-- DropForeignKey
ALTER TABLE "AdminAuditLog" DROP CONSTRAINT "AdminAuditLog_adminId_fkey";

-- DropForeignKey
ALTER TABLE "Album" DROP CONSTRAINT "Album_artistId_fkey";

-- DropForeignKey
ALTER TABLE "Album" DROP CONSTRAINT "Album_genreId_fkey";

-- DropForeignKey
ALTER TABLE "Artist" DROP CONSTRAINT "Artist_userId_fkey";

-- DropForeignKey
ALTER TABLE "ArtistRequest" DROP CONSTRAINT "ArtistRequest_reviewedBy_fkey";

-- DropForeignKey
ALTER TABLE "ArtistRequest" DROP CONSTRAINT "ArtistRequest_userId_fkey";

-- DropForeignKey
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_followerId_fkey";

-- DropForeignKey
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_followingId_fkey";

-- DropForeignKey
ALTER TABLE "ListeningHistory" DROP CONSTRAINT "ListeningHistory_trackId_fkey";

-- DropForeignKey
ALTER TABLE "ListeningHistory" DROP CONSTRAINT "ListeningHistory_userId_fkey";

-- DropForeignKey
ALTER TABLE "Playlist" DROP CONSTRAINT "Playlist_userId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistCollaborator" DROP CONSTRAINT "PlaylistCollaborator_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistCollaborator" DROP CONSTRAINT "PlaylistCollaborator_userId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistTrack" DROP CONSTRAINT "PlaylistTrack_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistTrack" DROP CONSTRAINT "PlaylistTrack_trackId_fkey";

-- DropForeignKey
ALTER TABLE "StreamingAnalytics" DROP CONSTRAINT "StreamingAnalytics_trackId_fkey";

-- DropForeignKey
ALTER TABLE "StreamingAnalytics" DROP CONSTRAINT "StreamingAnalytics_userId_fkey";

-- DropForeignKey
ALTER TABLE "Track" DROP CONSTRAINT "Track_albumId_fkey";

-- DropForeignKey
ALTER TABLE "Track" DROP CONSTRAINT "Track_artistId_fkey";

-- DropForeignKey
ALTER TABLE "Track" DROP CONSTRAINT "Track_genreId_fkey";

-- DropForeignKey
ALTER TABLE "TrackRating" DROP CONSTRAINT "TrackRating_trackId_fkey";

-- DropForeignKey
ALTER TABLE "TrackRating" DROP CONSTRAINT "TrackRating_userId_fkey";

-- DropForeignKey
ALTER TABLE "TrackRecommendation" DROP CONSTRAINT "TrackRecommendation_trackId_fkey";

-- DropForeignKey
ALTER TABLE "TrackRecommendation" DROP CONSTRAINT "TrackRecommendation_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserActivity" DROP CONSTRAINT "UserActivity_relatedTrackId_fkey";

-- DropForeignKey
ALTER TABLE "UserActivity" DROP CONSTRAINT "UserActivity_relatedUserId_fkey";

-- DropForeignKey
ALTER TABLE "UserActivity" DROP CONSTRAINT "UserActivity_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserFavorite" DROP CONSTRAINT "UserFavorite_trackId_fkey";

-- DropForeignKey
ALTER TABLE "UserFavorite" DROP CONSTRAINT "UserFavorite_userId_fkey";

-- DropIndex
DROP INDEX "TrackRecommendation_userId_idx";

-- AlterTable
ALTER TABLE "AdminAuditLog" DROP CONSTRAINT "AdminAuditLog_pkey",
DROP COLUMN "entityId",
DROP COLUMN "entityType",
ADD COLUMN     "targetId" TEXT NOT NULL,
ADD COLUMN     "targetName" TEXT,
ADD COLUMN     "targetType" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "adminId" SET DATA TYPE TEXT,
ALTER COLUMN "changes" SET DATA TYPE TEXT,
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "AdminAuditLog_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Album" DROP CONSTRAINT "Album_pkey",
DROP COLUMN "isExplicit",
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rating" DOUBLE PRECISION,
ADD COLUMN     "totalStreams" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "artistId" SET DATA TYPE TEXT,
ALTER COLUMN "releaseDate" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "releaseDate" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "totalTracks" SET NOT NULL,
ALTER COLUMN "genreId" SET DATA TYPE TEXT,
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "Album_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ArtistRequest" DROP CONSTRAINT "ArtistRequest_pkey",
DROP COLUMN "artistName",
DROP COLUMN "bio",
DROP COLUMN "rejectionReason",
DROP COLUMN "requestedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "reason" TEXT,
ADD COLUMN     "reviewComment" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "ArtistRequestStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "reviewedAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "reviewedBy" SET DATA TYPE TEXT,
ADD CONSTRAINT "ArtistRequest_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "followerId" SET DATA TYPE TEXT,
ALTER COLUMN "followingId" SET DATA TYPE TEXT,
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "Follow_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Genre" DROP CONSTRAINT "Genre_pkey",
ADD COLUMN     "color" VARCHAR(7),
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "Genre_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Playlist" DROP CONSTRAINT "Playlist_pkey",
DROP COLUMN "privacy",
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "totalStreams" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "totalTracks" SET NOT NULL,
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "PlaylistCollaborator" DROP CONSTRAINT "PlaylistCollaborator_pkey",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'EDITOR',
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "playlistId" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "addedAt" SET NOT NULL,
ALTER COLUMN "addedAt" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "PlaylistCollaborator_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Track" DROP CONSTRAINT "Track_pkey",
DROP COLUMN "audioFileSize",
DROP COLUMN "isActive",
DROP COLUMN "lyricsUrl",
DROP COLUMN "playCount",
DROP COLUMN "uploadedAt",
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isrc" TEXT,
ADD COLUMN     "rating" DOUBLE PRECISION,
ADD COLUMN     "releaseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "totalDownloads" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalStreams" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "artistId" SET DATA TYPE TEXT,
ALTER COLUMN "albumId" SET DATA TYPE TEXT,
ALTER COLUMN "isExplicit" SET NOT NULL,
ALTER COLUMN "genreId" SET DATA TYPE TEXT,
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "Track_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "TrackRecommendation" DROP CONSTRAINT "TrackRecommendation_pkey",
DROP COLUMN "userId",
ADD COLUMN     "relatedTrackId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "trackId" SET DATA TYPE TEXT,
ALTER COLUMN "score" SET NOT NULL,
ALTER COLUMN "score" SET DEFAULT 0,
ALTER COLUMN "score" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "TrackRecommendation_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "isEmailVerified",
DROP COLUMN "passwordHash",
DROP COLUMN "premiumEndDate",
DROP COLUMN "profileImage",
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "fullName" TEXT,
ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "premiumExpiresAt" TIMESTAMP(3),
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "isPremium" SET NOT NULL,
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Artist";

-- DropTable
DROP TABLE "ListeningHistory";

-- DropTable
DROP TABLE "PlaylistTrack";

-- DropTable
DROP TABLE "StreamingAnalytics";

-- DropTable
DROP TABLE "TrackRating";

-- DropTable
DROP TABLE "UserActivity";

-- DropTable
DROP TABLE "UserFavorite";

-- DropEnum
DROP TYPE "ArtistStatus";

-- DropEnum
DROP TYPE "PlaylistPrivacy";

-- DropEnum
DROP TYPE "StreamingQuality";

-- CreateTable
CREATE TABLE "ArtistProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "profileImage" TEXT,
    "bannerImage" TEXT,
    "totalTracks" INTEGER NOT NULL DEFAULT 0,
    "totalAlbums" INTEGER NOT NULL DEFAULT 0,
    "totalFollowers" INTEGER NOT NULL DEFAULT 0,
    "totalStreams" INTEGER NOT NULL DEFAULT 0,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArtistProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaylistItem" (
    "id" TEXT NOT NULL,
    "playlistId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlaylistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackLike" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrackLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlbumLike" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlbumLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StreamHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "streamedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER,
    "progress" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StreamHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "trackId" TEXT,
    "albumId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "pushNotifications" BOOLEAN NOT NULL DEFAULT true,
    "newReleaseNotifications" BOOLEAN NOT NULL DEFAULT true,
    "followerNotifications" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentReport" (
    "id" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "reportType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "targetName" TEXT,
    "reason" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArtistProfile_userId_key" ON "ArtistProfile"("userId");

-- CreateIndex
CREATE INDEX "ArtistProfile_userId_idx" ON "ArtistProfile"("userId");

-- CreateIndex
CREATE INDEX "ArtistProfile_isVerified_idx" ON "ArtistProfile"("isVerified");

-- CreateIndex
CREATE INDEX "PlaylistItem_playlistId_idx" ON "PlaylistItem"("playlistId");

-- CreateIndex
CREATE INDEX "PlaylistItem_trackId_idx" ON "PlaylistItem"("trackId");

-- CreateIndex
CREATE UNIQUE INDEX "PlaylistItem_playlistId_trackId_key" ON "PlaylistItem"("playlistId", "trackId");

-- CreateIndex
CREATE INDEX "Favorite_userId_idx" ON "Favorite"("userId");

-- CreateIndex
CREATE INDEX "Favorite_trackId_idx" ON "Favorite"("trackId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_trackId_key" ON "Favorite"("userId", "trackId");

-- CreateIndex
CREATE INDEX "TrackLike_userId_idx" ON "TrackLike"("userId");

-- CreateIndex
CREATE INDEX "TrackLike_trackId_idx" ON "TrackLike"("trackId");

-- CreateIndex
CREATE UNIQUE INDEX "TrackLike_userId_trackId_key" ON "TrackLike"("userId", "trackId");

-- CreateIndex
CREATE INDEX "AlbumLike_userId_idx" ON "AlbumLike"("userId");

-- CreateIndex
CREATE INDEX "AlbumLike_albumId_idx" ON "AlbumLike"("albumId");

-- CreateIndex
CREATE UNIQUE INDEX "AlbumLike_userId_albumId_key" ON "AlbumLike"("userId", "albumId");

-- CreateIndex
CREATE INDEX "StreamHistory_userId_idx" ON "StreamHistory"("userId");

-- CreateIndex
CREATE INDEX "StreamHistory_trackId_idx" ON "StreamHistory"("trackId");

-- CreateIndex
CREATE INDEX "StreamHistory_streamedAt_idx" ON "StreamHistory"("streamedAt");

-- CreateIndex
CREATE INDEX "Comment_userId_idx" ON "Comment"("userId");

-- CreateIndex
CREATE INDEX "Comment_trackId_idx" ON "Comment"("trackId");

-- CreateIndex
CREATE INDEX "Comment_createdAt_idx" ON "Comment"("createdAt");

-- CreateIndex
CREATE INDEX "Review_userId_idx" ON "Review"("userId");

-- CreateIndex
CREATE INDEX "Review_trackId_idx" ON "Review"("trackId");

-- CreateIndex
CREATE INDEX "Review_albumId_idx" ON "Review"("albumId");

-- CreateIndex
CREATE INDEX "Review_rating_idx" ON "Review"("rating");

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_trackId_albumId_key" ON "Review"("userId", "trackId", "albumId");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationSettings_userId_key" ON "NotificationSettings"("userId");

-- CreateIndex
CREATE INDEX "ContentReport_reporterId_idx" ON "ContentReport"("reporterId");

-- CreateIndex
CREATE INDEX "ContentReport_status_idx" ON "ContentReport"("status");

-- CreateIndex
CREATE INDEX "ContentReport_createdAt_idx" ON "ContentReport"("createdAt");

-- CreateIndex
CREATE INDEX "AdminAuditLog_action_idx" ON "AdminAuditLog"("action");

-- CreateIndex
CREATE INDEX "AdminAuditLog_targetType_idx" ON "AdminAuditLog"("targetType");

-- CreateIndex
CREATE INDEX "AdminAuditLog_createdAt_idx" ON "AdminAuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "Album_releaseDate_idx" ON "Album"("releaseDate");

-- CreateIndex
CREATE INDEX "Album_isPublished_idx" ON "Album"("isPublished");

-- CreateIndex
CREATE INDEX "ArtistRequest_status_idx" ON "ArtistRequest"("status");

-- CreateIndex
CREATE INDEX "ArtistRequest_createdAt_idx" ON "ArtistRequest"("createdAt");

-- CreateIndex
CREATE INDEX "Genre_name_idx" ON "Genre"("name");

-- CreateIndex
CREATE INDEX "Playlist_isPublic_idx" ON "Playlist"("isPublic");

-- CreateIndex
CREATE INDEX "Playlist_createdAt_idx" ON "Playlist"("createdAt");

-- CreateIndex
CREATE INDEX "Track_releaseDate_idx" ON "Track"("releaseDate");

-- CreateIndex
CREATE INDEX "Track_isPublished_idx" ON "Track"("isPublished");

-- CreateIndex
CREATE INDEX "TrackRecommendation_relatedTrackId_idx" ON "TrackRecommendation"("relatedTrackId");

-- CreateIndex
CREATE INDEX "TrackRecommendation_score_idx" ON "TrackRecommendation"("score");

-- CreateIndex
CREATE UNIQUE INDEX "TrackRecommendation_trackId_relatedTrackId_key" ON "TrackRecommendation"("trackId", "relatedTrackId");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- AddForeignKey
ALTER TABLE "ArtistProfile" ADD CONSTRAINT "ArtistProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtistRequest" ADD CONSTRAINT "ArtistRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "ArtistProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "ArtistProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistItem" ADD CONSTRAINT "PlaylistItem_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistItem" ADD CONSTRAINT "PlaylistItem_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistCollaborator" ADD CONSTRAINT "PlaylistCollaborator_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistCollaborator" ADD CONSTRAINT "PlaylistCollaborator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackLike" ADD CONSTRAINT "TrackLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackLike" ADD CONSTRAINT "TrackLike_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlbumLike" ADD CONSTRAINT "AlbumLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlbumLike" ADD CONSTRAINT "AlbumLike_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreamHistory" ADD CONSTRAINT "StreamHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreamHistory" ADD CONSTRAINT "StreamHistory_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackRecommendation" ADD CONSTRAINT "TrackRecommendation_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackRecommendation" ADD CONSTRAINT "TrackRecommendation_relatedTrackId_fkey" FOREIGN KEY ("relatedTrackId") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationSettings" ADD CONSTRAINT "NotificationSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
