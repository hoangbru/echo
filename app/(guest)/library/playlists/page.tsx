'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Music } from 'lucide-react'

export default function PlaylistsPage() {
  const [playlists] = useState<any[]>([])

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Your Playlists</h1>
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            <Plus className="w-5 h-5 mr-2" />
            Create Playlist
          </Button>
        </div>

        {/* Playlists Grid */}
        {playlists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {playlists.map((playlist) => (
              <Link key={playlist.id} href={`/playlist/${playlist.id}`}>
                <div className="bg-neutral-900 rounded-lg overflow-hidden hover:bg-neutral-800 transition cursor-pointer group">
                  <div className="aspect-square bg-gradient-to-br from-red-600 to-neutral-900 flex items-center justify-center">
                    <Music className="w-16 h-16 text-neutral-400" />
                  </div>
                  <div className="p-4">
                    <p className="font-semibold truncate">{playlist.name}</p>
                    <p className="text-sm text-neutral-400">
                      {playlist.totalTracks} songs
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Music className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No playlists yet</h2>
            <p className="text-neutral-400 mb-6">
              Create a new playlist to organize your favorite music
            </p>
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Playlist
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
