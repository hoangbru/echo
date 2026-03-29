"use client";

import { useEffect, useState } from "react";
import { getTrendingTracks, getTrendingArtists } from "@/lib/api-client";
import { usePlayer } from "@/lib/contexts/player-context";
import { TrackCard } from "@/components/track-card";
import { ArtistCard } from "@/components/artist-card";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollSlider } from "@/components/scroll-slider";

interface Track {
  id: string;
  title: string;
  artist: { username: string } & any;
  duration: number;
  audioUrl: string;
  coverImage?: string;
  album?: { title: string };
}

interface Artist {
  id: string;
  user: { username: string } & any;
  profileImage?: string;
  totalFollowers: number;
  isVerified: boolean;
}

const FEATURED_TRACKS: Track[] = [
  {
    id: "1",
    title: "Midnight Dreams",
    artist: "Synthwave Artists",
    album: { title: "Digital Nights" },
    coverImage:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop",
    duration: 245,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: "2",
    title: "Electric Pulse",
    artist: "Future Beats",
    album: { title: "Neon Highway" },
    coverImage:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop",
    duration: 198,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: "3",
    title: "Ethereal Wave",
    artist: "Ambient Visions",
    album: { title: "Cosmic Journey" },
    coverImage:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop",
    duration: 312,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
  {
    id: "4",
    title: "Urban Rhythm",
    artist: "City Sounds",
    album: { title: "Metro Beats" },
    coverImage:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop",
    duration: 224,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  },
  {
    id: "5",
    title: "Retro Vibes",
    artist: "Nostalgia Band",
    album: { title: "Golden Years" },
    coverImage:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 267,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  },
  {
    id: "6",
    title: "Cosmic Exploration",
    artist: "Space Odyssey",
    album: { title: "Beyond Stars" },
    coverImage:
      "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&h=400&fit=crop",
    duration: 298,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
  },
];

const TRENDING_TRACKS: Track[] = [
  {
    id: "5",
    title: "Retro Vibes",
    artist: "Nostalgia Band",
    album: { title: "Golden Years" },
    coverImage:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 267,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  },
  {
    id: "6",
    title: "Cosmic Exploration",
    artist: "Space Odyssey",
    album: { title: "Beyond Stars" },
    coverImage:
      "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&h=400&fit=crop",
    duration: 298,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
  },
];

const ARTIST_TRENDS: Artist[] = [
  {
    id: "1",
    user: { username: "Synthwave Artists" },
    profileImage:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop",
    totalFollowers: 125000,
    isVerified: true,
  },
  {
    id: "2",
    user: { username: "Future Beats" },
    profileImage:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop",
    totalFollowers: 98000,
    isVerified: false,
  },
  {
    id: "3",
    user: { username: "Ambient Visions" },
    profileImage:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop",
    totalFollowers: 75000,
    isVerified: true,
  },
  {
    id: "4",
    user: { username: "City Sounds" },
    profileImage:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop",
    totalFollowers: 62000,
    isVerified: false,
  },
  {
    id: "5",
    user: { username: "Nostalgia Band" },
    profileImage:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    totalFollowers: 54000,
    isVerified: true,
  },
  {
    id: "6",
    user: { username: "Space Odyssey" },
    profileImage:
      "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&h=400&fit=crop",
    totalFollowers: 43000,
    isVerified: false,
  },
];

export default function HomePage() {
  const { play } = usePlayer();
  const [trendingTracks, setTrendingTracks] =
    useState<Track[]>(FEATURED_TRACKS);
  const [trendingArtists, setTrendingArtists] = useState<Artist[]>(ARTIST_TRENDS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [tracks, artists] = await Promise.all([
          getTrendingTracks(10),
          getTrendingArtists(6),
        ]);
        setTrendingTracks(tracks || []);
        setTrendingArtists(artists || []);
      } catch (error) {
        console.error("Failed to load trending data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handlePlayAll = () => {
    if (trendingTracks.length > 0) {
      play(trendingTracks[0], trendingTracks);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-red-600/10 to-transparent p-8 md:p-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to Echo
          </h1>
          <p className="text-lg text-neutral-300 mb-8">
            Discover millions of songs, artists, and playlists from around the
            world.
          </p>
          <Button
            onClick={handlePlayAll}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Play className="w-5 h-5 mr-2 fill-current" />
            Play Trending Now
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 pb-32">
        {/* Trending Tracks */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Trending Now</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="bg-neutral-800 rounded-lg h-64 animate-pulse"
                />
              ))}
            </div>
          ) : trendingTracks.length > 0 ? (
            <ScrollSlider
              items={trendingTracks}
              renderItem={(track) => <TrackCard track={track} />}
              itemWidth="min-w-[230px]"
            />
          ) : (
            <p className="text-neutral-400">No trending tracks available</p>
          )}
        </section>

        {/* Trending Artists */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Featured Artists
          </h2>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-neutral-800 rounded-lg h-40 animate-pulse"
                />
              ))}
            </div>
          ) : trendingArtists.length > 0 ? (
            <ScrollSlider
              items={trendingArtists}
              renderItem={(artist) => <ArtistCard artist={artist} />}
              itemWidth="min-w-[160px]"
            />
          ) : (
            <p className="text-neutral-400">No featured artists available</p>
          )}
        </section>
      </div>
    </div>
  );
}
