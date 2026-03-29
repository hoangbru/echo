'use client'

import { useEffect, useState } from 'react'
import { getGenres, getTracksByGenre } from '@/lib/api-client'
import { TrackCard } from '@/components/track-card'
import { Button } from '@/components/ui/button'

interface Genre {
  id: string
  name: string
  icon?: string
  color?: string
}

interface Track {
  id: string
  title: string
  artist: { username: string } & any
  duration: number
  audioUrl: string
  coverImage?: string
}

export default function ExplorePage() {
  const [genres, setGenres] = useState<Genre[]>([])
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadGenres() {
      try {
        const data = await getGenres()
        setGenres(data || [])
        if (data && data.length > 0) {
          setSelectedGenre(data[0].id)
        }
      } catch (error) {
        console.error('Failed to load genres:', error)
      }
    }
    loadGenres()
  }, [])

  useEffect(() => {
    async function loadTracks() {
      if (!selectedGenre) return
      try {
        setLoading(true)
        const data = await getTracksByGenre(selectedGenre, 20)
        setTracks(data || [])
      } catch (error) {
        console.error('Failed to load tracks:', error)
      } finally {
        setLoading(false)
      }
    }
    loadTracks()
  }, [selectedGenre])

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Explore Music</h1>

        {/* Genre Filter */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Browse by Genre</h2>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <Button
                key={genre.id}
                onClick={() => setSelectedGenre(genre.id)}
                variant={selectedGenre === genre.id ? 'default' : 'outline'}
                className={selectedGenre === genre.id ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                {genre.icon} {genre.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Tracks Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-6">
            {genres.find(g => g.id === selectedGenre)?.name || 'Music'}
          </h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="bg-neutral-800 rounded-lg h-64 animate-pulse" />
              ))}
            </div>
          ) : tracks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {tracks.map((track) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </div>
          ) : (
            <p className="text-neutral-400">No tracks found in this genre</p>
          )}
        </div>
      </div>
    </div>
  )
}
