import bcryptjs from "bcryptjs";
import { prisma } from "./prisma";

export async function hashPassword(password: string): Promise<string> {
  return bcryptjs.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcryptjs.compare(password, hash);
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function getUserByUsername(username: string) {
  return prisma.user.findUnique({
    where: { username },
  });
}

export async function createUser(data: {
  email: string;
  username: string;
  displayName?: string;
  passwordHash: string;
}) {
  return prisma.user.create({
    data: {
      ...data,
      role: "USER",
    },
  });
}

export async function getArtistProfile(userId: string) {
  return prisma.artist.findUnique({
    where: { userId },
    include: {
      user: true,
      _count: {
        select: {
          followers: true,
          tracks: true,
          albums: true,
        },
      },
    },
  });
}

export async function getPendingArtistRequests() {
  return prisma.artist.findMany({
    where: { status: "PENDING" },
    include: {
      user: true,
      artistRequests: {
        where: { status: "pending" },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function approveArtist(
  artistId: string,
  adminId: string,
  notes?: string
) {
  return prisma.artist.update({
    where: { id: artistId },
    data: {
      status: "APPROVED",
      approvedAt: new Date(),
      approvalNotes: notes,
    },
  });
}

export async function rejectArtist(
  artistId: string,
  adminId: string,
  reason?: string
) {
  return prisma.artist.update({
    where: { id: artistId },
    data: {
      status: "REJECTED",
      approvalNotes: reason,
    },
  });
}
