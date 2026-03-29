'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { getTrackById } from '@/lib/api-client'
import { usePlayer } from '@/lib/contexts/player-context'
import { Button } from '@/components/ui/button'
import { Heart, Play, Share2 } from 'lucide-react'

interface TrackDetail {
  id: string
  title: string
  artist: { id: string; username: string } & any
  album?: { id: string; title: string; coverImage: string }
  duration: number
  audioUrl: string
  coverImage?: string
  totalStreams: number
  rating?: number
  isExplicit?: boolean
  releaseDate: string
  lyrics?: string
}

export default function TrackPage() {
  const params = useParams()
  const trackId = params.id as string
  const { play } = usePlayer()
  const [track, setTrack] = useState<TrackDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    async function loadTrack() {
      try {
        const data = await getTrackById(trackId)
        setTrack(data as TrackDetail)
      } catch (error) {
        console.error('Failed to load track:', error)
      } finally {
        setLoading(false)
      }
    }
    if (trackId) {
      loadTrack()
    }
  }, [trackId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black p-8 flex items-center justify-center">
        <div className="text-neutral-400">Loading track...</div>
      </div>
    )
  }

  if (!track) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black p-8 flex items-center justify-center">
        <div className="text-neutral-400">Track not found</div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black pb-32">
      {/* Hero Section */}
      <div className="relative h-80 bg-gradient-to-b from-red-600/20 to-transparent p-8 flex items-end">
        <div className="flex gap-8 w-full">
          {/* Album Cover */}
          <div className="w-48 h-48 relative rounded-lg overflow-hidden shadow-lg flex-shrink-0">
            {track.album?.coverImage ? (
              <Image
                src={track.album.coverImage}
                alt={track.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-neutral-700 to-neutral-900 flex items-center justify-center text-6xl">
                🎵
              </div>
            )}
          </div>

          {/* Track Info */}
          <div className="flex-1 pb-4">
            <p className="text-sm text-neutral-400 mb-2">Track</p>
            <h1 className="text-5xl font-bold mb-4">{track.title}</h1>
            <p className="text-lg text-neutral-300 mb-4">
              By{' '}
              <a href={`/artist/${track.artist.id}`} className="hover:underline">
                {track.artist.username}
              </a>
            </p>

            {track.album && (
              <p className="text-neutral-400 mb-4">
                From <a href={`/album/${track.album.id}`} className="hover:underline">
                  {track.album.title}
                </a>
              </p>
            )}

            <div className="flex items-center gap-4">
              <Button
                onClick={() => play(track as any)}
                className="bg-red-600 hover:bg-red-700 text-white rounded-full px-8 py-2"
              >
                <Play className="w-5 h-5 mr-2 fill-white" />
                Play
              </Button>

              <Button
                onClick={() => setIsFavorite(!isFavorite)}
                variant="outline"
                className="border-neutral-600 hover:border-white rounded-full px-4"
              >
                <Heart
                  className={`w-5 h-5 ${isFavorite ? 'fill-red-600 text-red-600' : ''}`}
                />
              </Button>

              <Button
                variant="outline"
                className="border-neutral-600 hover:border-white rounded-full px-4"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-neutral-900 rounded-lg p-4">
            <p className="text-neutral-400 text-sm mb-1">Duration</p>
            <p className="text-2xl font-bold">
              {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}
            </p>
          </div>

          <div className="bg-neutral-900 rounded-lg p-4">
            <p className="text-neutral-400 text-sm mb-1">Streams</p>
            <p className="text-2xl font-bold">
              {(track.totalStreams / 1000000).toFixed(1)}M
            </p>
          </div>

          <div className="bg-neutral-900 rounded-lg p-4">
            <p className="text-neutral-400 text-sm mb-1">Released</p>
            <p className="text-lg font-bold">{formatDate(track.releaseDate)}</p>
          </div>

          {track.rating && (
            <div className="bg-neutral-900 rounded-lg p-4">
              <p className="text-neutral-400 text-sm mb-1">Rating</p>
              <p className="text-2xl font-bold">{track.rating.toFixed(1)} ⭐</p>
            </div>
          )}
        </div>

        {track.isExplicit && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-8">
            <p className="text-sm">
              <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold mr-2">
                EXPLICIT
              </span>
              This track contains explicit content
            </p>
          </div>
        )}

        {track.lyrics && (
          <div className="bg-neutral-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Lyrics</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-neutral-300 whitespace-pre-wrap">{track.lyrics}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
