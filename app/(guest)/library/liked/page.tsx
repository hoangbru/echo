// 'use client'

// import { useState, useEffect } from 'react'
// import { getUserFavorites } from '@/lib/api-client'
// import { usePlayer } from '@/lib/contexts/player-context'
// import { Button } from '@/components/ui/button'
// import { Play, Heart } from 'lucide-react'
// import Image from 'next/image'

// interface FavoriteTrack {
//   id: string
//   title: string
//   artist: { username: string; id: string } & any
//   duration: number
//   audioUrl: string
//   album?: { coverImage: string }
//   track?: any
// }

// export default function LikedSongsPage() {
//   const { play } = usePlayer()
//   const [tracks, setTracks] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     async function loadFavorites() {
//       try {
//         // Note: This would need a user ID from auth context
//         // const data = await getUserFavorites(userId)
//         // setTracks(data || [])
//         setLoading(false)
//       } catch (error) {
//         console.error('Failed to load favorites:', error)
//         setLoading(false)
//       }
//     }
//     loadFavorites()
//   }, [])

//   const handlePlayAll = () => {
//     if (tracks.length > 0) {
//       play(tracks[0].track, tracks.map(t => t.track))
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div className="flex items-center gap-4">
//             <div className="w-32 h-32 bg-gradient-to-br from-red-600 to-red-900 rounded-lg flex items-center justify-center">
//               <Heart className="w-16 h-16 text-white fill-white" />
//             </div>
//             <div>
//               <p className="text-sm font-semibold text-neutral-400">Playlist</p>
//               <h1 className="text-5xl font-bold mb-2">Liked Songs</h1>
//               <p className="text-neutral-400">
//                 {tracks.length} {tracks.length === 1 ? 'song' : 'songs'}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Play Button */}
//         {tracks.length > 0 && (
//           <Button
//             onClick={handlePlayAll}
//             className="bg-red-600 hover:bg-red-700 text-white rounded-full px-8 mb-8"
//           >
//             <Play className="w-5 h-5 mr-2 fill-white" />
//             Play All
//           </Button>
//         )}

//         {/* Tracks List */}
//         {loading ? (
//           <div className="space-y-2">
//             {[...Array(5)].map((_, i) => (
//               <div key={i} className="bg-neutral-800 rounded-lg h-16 animate-pulse" />
//             ))}
//           </div>
//         ) : tracks.length > 0 ? (
//           <div className="space-y-2">
//             {tracks.map((fav, idx) => {
//               const track = fav.track
//               return (
//                 <div
//                   key={track.id}
//                   className="bg-neutral-900 hover:bg-neutral-800 rounded-lg p-4 flex items-center gap-4 transition group cursor-pointer"
//                   onClick={() => play(track)}
//                 >
//                   {/* Index */}
//                   <span className="w-8 text-center text-neutral-400 group-hover:hidden">
//                     {idx + 1}
//                   </span>
//                   <Play className="w-5 h-5 text-red-600 hidden group-hover:block flex-shrink-0" />

//                   {/* Album Art */}
//                   {track.album?.coverImage && (
//                     <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 relative">
//                       <Image
//                         src={track.album.coverImage}
//                         alt={track.title}
//                         fill
//                         className="object-cover"
//                       />
//                     </div>
//                   )}

//                   {/* Track Info */}
//                   <div className="flex-1 min-w-0">
//                     <p className="font-semibold truncate">{track.title}</p>
//                     <p className="text-sm text-neutral-400 truncate">
//                       {track.artist?.username}
//                     </p>
//                   </div>

//                   {/* Duration */}
//                   <div className="text-neutral-400 text-sm">
//                     {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         ) : (
//           <div className="text-center py-12">
//             <Heart className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
//             <h2 className="text-2xl font-semibold mb-2">No liked songs yet</h2>
//             <p className="text-neutral-400">
//               Like songs to see them here
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
