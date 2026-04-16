// 'use client'

// import { useEffect, useState } from 'react'
// import { useParams } from 'next/navigation'
// import Image from 'next/image'
// import { getAlbumById } from '@/lib/api-client'
// import { usePlayer } from '@/lib/contexts/player-context'
// import { Button } from '@/components/ui/button'
// import { Play, Heart, Share2 } from 'lucide-react'
// import Link from 'next/link'

// interface AlbumDetail {
//   id: string
//   title: string
//   artist: { id: string; user: { username: string } } & any
//   description?: string
//   coverImage?: string
//   releaseDate: string
//   totalTracks: number
//   totalStreams: number
//   rating?: number
//   tracks?: Array<any>
// }

// export default function AlbumPage() {
//   const params = useParams()
//   const albumId = params.id as string
//   const { play } = usePlayer()
//   const [album, setAlbum] = useState<AlbumDetail | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [isFavorite, setIsFavorite] = useState(false)

//   useEffect(() => {
//     async function loadAlbum() {
//       try {
//         const data = await getAlbumById(albumId)
//         setAlbum(data as AlbumDetail)
//       } catch (error) {
//         console.error('Failed to load album:', error)
//       } finally {
//         setLoading(false)
//       }
//     }
//     if (albumId) {
//       loadAlbum()
//     }
//   }, [albumId])

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black p-8 flex items-center justify-center">
//         <div className="text-neutral-400">Loading album...</div>
//       </div>
//     )
//   }

//   if (!album) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black p-8 flex items-center justify-center">
//         <div className="text-neutral-400">Album not found</div>
//       </div>
//     )
//   }

//   const handlePlayAll = () => {
//     if (album.tracks && album.tracks.length > 0) {
//       play(album.tracks[0], album.tracks)
//     }
//   }

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     })
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black pb-32">
//       {/* Hero Section */}
//       <div className="relative bg-gradient-to-b from-red-600/10 to-transparent p-8 flex items-end min-h-80">
//         <div className="flex gap-8 w-full">
//           {/* Album Cover */}
//           <div className="w-48 h-48 relative rounded-lg overflow-hidden shadow-lg flex-shrink-0">
//             {album.coverImage ? (
//               <Image
//                 src={album.coverImage}
//                 alt={album.title}
//                 fill
//                 className="object-cover"
//               />
//             ) : (
//               <div className="w-full h-full bg-gradient-to-br from-neutral-700 to-neutral-900 flex items-center justify-center text-6xl">
//                 🎵
//               </div>
//             )}
//           </div>

//           {/* Album Info */}
//           <div className="flex-1 pb-4">
//             <p className="text-sm text-neutral-400 mb-2">Album</p>
//             <h1 className="text-5xl font-bold mb-4">{album.title}</h1>
//             <p className="text-lg text-neutral-300 mb-4">
//               By{' '}
//               <Link href={`/artist/${album.artist.id}`} className="hover:underline">
//                 {album.artist.user.username}
//               </Link>
//             </p>

//             <p className="text-neutral-400 mb-6">
//               {album.totalTracks} tracks • Released {formatDate(album.releaseDate)}
//             </p>

//             <div className="flex items-center gap-4">
//               <Button
//                 onClick={handlePlayAll}
//                 className="bg-red-600 hover:bg-red-700 text-white rounded-full px-8 py-2"
//               >
//                 <Play className="w-5 h-5 mr-2 fill-white" />
//                 Play Album
//               </Button>

//               <Button
//                 onClick={() => setIsFavorite(!isFavorite)}
//                 variant="outline"
//                 className="border-neutral-600 hover:border-white rounded-full px-4"
//               >
//                 <Heart
//                   className={`w-5 h-5 ${isFavorite ? 'fill-red-600 text-red-600' : ''}`}
//                 />
//               </Button>

//               <Button
//                 variant="outline"
//                 className="border-neutral-600 hover:border-white rounded-full px-4"
//               >
//                 <Share2 className="w-5 h-5" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Album Stats */}
//       <div className="max-w-4xl mx-auto px-8 py-8">
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
//           <div className="bg-neutral-900 rounded-lg p-4">
//             <p className="text-neutral-400 text-sm mb-1">Total Tracks</p>
//             <p className="text-2xl font-bold">{album.totalTracks}</p>
//           </div>

//           <div className="bg-neutral-900 rounded-lg p-4">
//             <p className="text-neutral-400 text-sm mb-1">Streams</p>
//             <p className="text-2xl font-bold">
//               {(album.totalStreams / 1000000).toFixed(1)}M
//             </p>
//           </div>

//           <div className="bg-neutral-900 rounded-lg p-4">
//             <p className="text-neutral-400 text-sm mb-1">Released</p>
//             <p className="text-lg font-bold">{formatDate(album.releaseDate)}</p>
//           </div>

//           {album.rating && (
//             <div className="bg-neutral-900 rounded-lg p-4">
//               <p className="text-neutral-400 text-sm mb-1">Rating</p>
//               <p className="text-2xl font-bold">{album.rating.toFixed(1)} ⭐</p>
//             </div>
//           )}
//         </div>

//         {album.description && (
//           <div className="bg-neutral-900 rounded-lg p-6 mb-12">
//             <h2 className="text-xl font-bold mb-3">About</h2>
//             <p className="text-neutral-300">{album.description}</p>
//           </div>
//         )}

//         {/* Tracklist */}
//         <div>
//           <h2 className="text-2xl font-bold mb-6">Tracklist</h2>
//           <div className="space-y-2">
//             {album.tracks && album.tracks.length > 0 ? (
//               album.tracks.map((track, idx) => (
//                 <div
//                   key={track.id}
//                   className="bg-neutral-900 hover:bg-neutral-800 rounded-lg p-4 flex items-center gap-4 transition group cursor-pointer"
//                   onClick={() => play(track)}
//                 >
//                   <span className="w-8 text-center text-neutral-400 group-hover:hidden">
//                     {idx + 1}
//                   </span>
//                   <Play className="w-5 h-5 text-red-600 hidden group-hover:block flex-shrink-0 fill-current" />

//                   <div className="flex-1 min-w-0">
//                     <p className="font-semibold truncate">{track.title}</p>
//                     <p className="text-sm text-neutral-400 truncate">
//                       {track.artist?.user?.username}
//                     </p>
//                   </div>

//                   <div className="text-neutral-400 text-sm">
//                     {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-neutral-400">No tracks available</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
