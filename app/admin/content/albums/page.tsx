'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import Image from 'next/image';

interface Album {
  id: string;
  title: string;
  artist: string;
  releaseDate: string;
  trackCount: number;
  image?: string;
  genre: string;
}

// Mock data
const MOCK_ALBUMS: Album[] = [
  {
    id: '1',
    title: 'Digital Nights',
    artist: 'The Midnight Wanderer',
    releaseDate: '2024-01-15',
    trackCount: 12,
    genre: 'Electronic',
    image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd8d2c17?w=300&h=300&fit=crop',
  },
  {
    id: '2',
    title: 'Neon Highway',
    artist: 'Luna Sky',
    releaseDate: '2023-11-20',
    trackCount: 10,
    genre: 'Indie Folk',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=300&h=300&fit=crop',
  },
  {
    id: '3',
    title: 'Urban Rhythm',
    artist: 'Urban Beats Collective',
    releaseDate: '2024-02-10',
    trackCount: 15,
    genre: 'Hip-Hop',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
  },
];

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>(MOCK_ALBUMS);

  const deleteAlbum = (id: string) => {
    setAlbums(albums.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Albums</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Total albums: {albums.length}
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Album
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {albums.map((album) => (
          <div key={album.id} className="bg-card rounded-lg border border-border overflow-hidden hover:border-primary transition">
            <div className="relative aspect-square bg-secondary overflow-hidden">
              {album.image && (
                <Image
                  src={album.image}
                  alt={album.title}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h3 className="font-semibold text-foreground truncate">{album.title}</h3>
                <p className="text-sm text-muted-foreground">{album.artist}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {album.genre} • {album.trackCount} tracks
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Released: {new Date(album.releaseDate).toLocaleDateString()}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1">
                  <Edit2 className="h-3 w-3" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteAlbum(album.id)}
                >
                  <Trash2 className="h-3 w-3 text-red-500" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
