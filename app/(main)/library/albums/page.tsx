'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Music } from 'lucide-react'

export default function SavedAlbumsPage() {
  const [albums] = useState<any[]>([])

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Saved Albums</h1>

        {albums.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {albums.map((album) => (
              <Link key={album.id} href={`/album/${album.id}`}>
                <div className="bg-neutral-900 rounded-lg overflow-hidden hover:bg-neutral-800 transition cursor-pointer group">
                  <div className="aspect-square bg-neutral-800 relative overflow-hidden">
                    {album.coverImage ? (
                      <Image
                        src={album.coverImage}
                        alt={album.title}
                        fill
                        className="object-cover group-hover:scale-110 transition"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        🎵
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-semibold truncate">{album.title}</p>
                    <p className="text-sm text-neutral-400">
                      {album.artist?.user?.username}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Music className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No saved albums</h2>
            <p className="text-neutral-400">
              Like albums to see them in your library
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
