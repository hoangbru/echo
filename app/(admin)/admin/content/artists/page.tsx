'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Edit2, CheckCircle, XCircle } from 'lucide-react';
import Image from 'next/image';

interface Artist {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  followers: number;
  image?: string;
  bio: string;
}

// Mock data
const MOCK_ARTISTS: Artist[] = [
  {
    id: '1',
    name: 'The Midnight Wanderer',
    email: 'artist1@echo.com',
    verified: true,
    followers: 45200,
    bio: 'Electronic music producer and DJ',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
  },
  {
    id: '2',
    name: 'Luna Sky',
    email: 'artist2@echo.com',
    verified: false,
    followers: 12300,
    bio: 'Indie folk singer-songwriter',
    image: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&h=300&fit=crop',
  },
  {
    id: '3',
    name: 'Urban Beats Collective',
    email: 'collective@echo.com',
    verified: true,
    followers: 89500,
    bio: 'Hip-hop and rap collective',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=300&h=300&fit=crop',
  },
];

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>(MOCK_ARTISTS);
  const [editingId, setEditingId] = useState<string | null>(null);

  const toggleVerification = (id: string) => {
    setArtists(artists.map(a => 
      a.id === id ? { ...a, verified: !a.verified } : a
    ));
  };

  const deleteArtist = (id: string) => {
    setArtists(artists.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Artists</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Total artists: {artists.length}
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Artist
        </Button>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Artist</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Followers</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {artists.map((artist) => (
              <tr key={artist.id} className="hover:bg-secondary transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    {artist.image && (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden">
                        <Image
                          src={artist.image}
                          alt={artist.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-foreground">{artist.name}</p>
                      <p className="text-xs text-muted-foreground">{artist.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {artist.followers.toLocaleString()} followers
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {artist.verified ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-500">Verified</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm text-yellow-500">Pending</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleVerification(artist.id)}
                    >
                      {artist.verified ? 'Unverify' : 'Verify'}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteArtist(artist.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
