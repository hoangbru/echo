'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  image?: string;
  uploadedAt: string;
  streams: number;
  isActive: boolean;
}

const INITIAL_TRACKS: AdminTrack[] = [
  {
    id: '1',
    title: 'Midnight Dreams',
    artist: 'Synthwave Artists',
    album: 'Digital Nights',
    duration: 245,
    image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd8d2c17?w=100&h=100&fit=crop',
    uploadedAt: '2024-01-20',
    streams: 45230,
    isActive: true,
  },
  {
    id: '2',
    title: 'Electric Pulse',
    artist: 'Future Beats',
    album: 'Neon Highway',
    duration: 198,
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=100&h=100&fit=crop',
    uploadedAt: '2024-01-18',
    streams: 32150,
    isActive: true,
  },
  {
    id: '3',
    title: 'Ethereal Wave',
    artist: 'Ambient Visions',
    album: 'Cosmic Journey',
    duration: 312,
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=100&h=100&fit=crop',
    uploadedAt: '2024-01-15',
    streams: 28900,
    isActive: true,
  },
];

export default function TracksManagementPage() {
  const [tracks, setTracks] = useState(INITIAL_TRACKS);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const deleteTrack = (id: string) => {
    setTracks(tracks.filter((t) => t.id !== id));
  };

  const toggleTrackStatus = (id: string) => {
    setTracks(
      tracks.map((t) =>
        t.id === id ? { ...t, isActive: !t.isActive } : t
      )
    );
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="space-y-8 px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Track Management</h1>
          <p className="text-muted-foreground">{tracks.length} tracks total</p>
        </div>
        <Button
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => setShowUploadModal(true)}
        >
          <Plus className="h-5 w-5 mr-2" />
          Upload Track
        </Button>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-card rounded-lg p-8 max-w-md w-full space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Upload New Track</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Track Title
                </label>
                <input
                  type="text"
                  placeholder="Track title"
                  className="w-full rounded-lg bg-secondary px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Artist
                </label>
                <input
                  type="text"
                  placeholder="Artist name"
                  className="w-full rounded-lg bg-secondary px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Album
                </label>
                <input
                  type="text"
                  placeholder="Album name"
                  className="w-full rounded-lg bg-secondary px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Audio File
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground mt-1">MP3, WAV or FLAC</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowUploadModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => setShowUploadModal(false)}
              >
                Upload
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tracks Table */}
      <div className="bg-card rounded-lg border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-foreground"></th>
              <th className="px-6 py-3 text-left font-semibold text-foreground">Title</th>
              <th className="px-6 py-3 text-left font-semibold text-foreground">Artist</th>
              <th className="px-6 py-3 text-left font-semibold text-foreground">Album</th>
              <th className="px-6 py-3 text-left font-semibold text-foreground">Streams</th>
              <th className="px-6 py-3 text-left font-semibold text-foreground">Uploaded</th>
              <th className="px-6 py-3 text-left font-semibold text-foreground">Status</th>
              <th className="px-6 py-3 text-left font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tracks.map((track) => (
              <tr key={track.id} className="border-b border-border hover:bg-secondary transition">
                <td className="px-6 py-3">
                  {track.image && (
                    <Image
                      src={track.image}
                      alt={track.title}
                      width={40}
                      height={40}
                      className="rounded w-10 h-10 object-cover"
                    />
                  )}
                </td>
                <td className="px-6 py-3 text-foreground font-medium">{track.title}</td>
                <td className="px-6 py-3 text-muted-foreground">{track.artist}</td>
                <td className="px-6 py-3 text-muted-foreground">{track.album}</td>
                <td className="px-6 py-3 text-foreground">{formatNumber(track.streams)}</td>
                <td className="px-6 py-3 text-muted-foreground">{track.uploadedAt}</td>
                <td className="px-6 py-3">
                  <button
                    onClick={() => toggleTrackStatus(track.id)}
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                      track.isActive
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {track.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-6 py-3">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingId(track.id)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTrack(track.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
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
