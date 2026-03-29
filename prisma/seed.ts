import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create genres
  const genres = await prisma.genre.createMany({
    data: [
      {
        name: "Pop",
        slug: "pop",
        description: "Popular music with catchy melodies",
        iconUrl: "🎵",
      },
      {
        name: "Rock",
        slug: "rock",
        description: "Rock music with guitars and powerful vocals",
        iconUrl: "🎸",
      },
      {
        name: "Hip-Hop",
        slug: "hip-hop",
        description: "Hip-hop and rap music",
        iconUrl: "🎤",
      },
      {
        name: "Electronic",
        slug: "electronic",
        description: "Electronic and dance music",
        iconUrl: "🎹",
      },
      {
        name: "Jazz",
        slug: "jazz",
        description: "Jazz and improvisation",
        iconUrl: "🎷",
      },
      {
        name: "Classical",
        slug: "classical",
        description: "Classical music and symphonies",
        iconUrl: "🎻",
      },
      {
        name: "Indie",
        slug: "indie",
        description: "Independent music",
        iconUrl: "🎧",
      },
      {
        name: "R&B",
        slug: "r-and-b",
        description: "Rhythm and blues",
        iconUrl: "🎶",
      },
    ],
    skipDuplicates: true,
  });

  console.log(`Created ${genres.count} genres`);

  // Create demo users (admin, artist, regular users)
  const adminPassword = await bcryptjs.hash("admin@123", 10);
  const artistPassword = await bcryptjs.hash("artist@123", 10);
  const userPassword = await bcryptjs.hash("user@123", 10);

  // Admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@echo.test" },
    update: {},
    create: {
      email: "admin@echo.test",
      username: "admin",
      displayName: "Echo Admin",
      passwordHash: adminPassword,
      role: "ADMIN",
      emailVerified: true,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    },
  });

  console.log("Created admin user:", admin.email);

  // Artist user
  const artistUser = await prisma.user.upsert({
    where: { email: "artist@echo.test" },
    update: {},
    create: {
      email: "artist@echo.test",
      username: "luna_artist",
      displayName: "Luna",
      passwordHash: artistPassword,
      role: "ARTIST",
      emailVerified: true,
      bio: "Electronic music producer from Sweden",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=luna",
    },
  });

  // Create artist profile
  const artist = await prisma.artist.upsert({
    where: { userId: artistUser.id },
    update: {},
    create: {
      userId: artistUser.id,
      bio: "Electronic music producer from Sweden",
      status: "APPROVED",
      approvedAt: new Date(),
    },
  });

  console.log("Created artist:", artistUser.displayName);

  // Regular users
  const user1 = await prisma.user.upsert({
    where: { email: "user1@echo.test" },
    update: {},
    create: {
      email: "user1@echo.test",
      username: "john_doe",
      displayName: "John Doe",
      passwordHash: userPassword,
      role: "USER",
      emailVerified: true,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "user2@echo.test" },
    update: {},
    create: {
      email: "user2@echo.test",
      username: "jane_smith",
      displayName: "Jane Smith",
      passwordHash: userPassword,
      role: "USER",
      emailVerified: true,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
    },
  });

  console.log("Created regular users");

  // Get genre IDs
  const popGenre = await prisma.genre.findUnique({ where: { slug: "pop" } });
  const electronicGenre = await prisma.genre.findUnique({
    where: { slug: "electronic" },
  });

  // Create albums
  const album1 = await prisma.album.create({
    data: {
      title: "Neon Dreams",
      slug: "neon-dreams",
      description: "A collection of electronic pop tracks",
      releaseDate: new Date("2024-01-15"),
      artistId: artist.id,
      genreId: electronicGenre?.id || "",
      trackCount: 3,
    },
  });

  console.log("Created album:", album1.title);

  // Create sample tracks
  const tracks = await prisma.track.createMany({
    data: [
      {
        title: "Midnight Echo",
        slug: "midnight-echo",
        description: "A serene electronic track",
        artistId: artist.id,
        albumId: album1.id,
        genreId: electronicGenre?.id || "",
        audioUrl:
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        duration: 245,
        coverUrl: album1.coverUrl,
        releaseDate: new Date("2024-01-15"),
        isExplicit: false,
      },
      {
        title: "Digital Sunrise",
        slug: "digital-sunrise",
        description: "An uplifting electronic piece",
        artistId: artist.id,
        albumId: album1.id,
        genreId: electronicGenre?.id || "",
        audioUrl:
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        duration: 263,
        coverUrl: album1.coverUrl,
        releaseDate: new Date("2024-01-15"),
        isExplicit: false,
      },
      {
        title: "Neon Lights",
        slug: "neon-lights",
        description: "A vibrant electronic dance track",
        artistId: artist.id,
        albumId: album1.id,
        genreId: electronicGenre?.id || "",
        audioUrl:
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        duration: 287,
        coverUrl: album1.coverUrl,
        releaseDate: new Date("2024-01-15"),
        isExplicit: false,
      },
    ],
  });

  console.log(`Created ${tracks.count} sample tracks`);

  // Create playlist
  const playlist = await prisma.playlist.create({
    data: {
      name: "My Favorites",
      description: "My favorite tracks from Echo",
      ownerId: user1.id,
      type: "PRIVATE",
    },
  });

  console.log("Created playlist:", playlist.name);

  console.log("Database seeding completed!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
