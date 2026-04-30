// 'use client'

// import { useEffect, useState } from 'react'
// import { useParams } from 'next/navigation'
// import Image from 'next/image'
// import { getArtistById } from '@/lib/api-client'
// import { usePlayer } from '@/lib/contexts/player-context'
// import { Button } from '@/components/ui/button'
// import { Play, Heart, Share2, Music } from 'lucide-react'
// import { TrackCard } from '@/components/track-card'
// import { VerifiedBadge } from '@/components/verified-badge'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// interface ArtistDetail {
//   id: string
//   user: { username: string; avatar?: string }
//   bio?: string
//   profileImage?: string
//   bannerImage?: string
//   isVerified: boolean
//   totalFollowers: number
//   totalStreams: number
//   totalAlbums: number
//   totalTracks: number
//   albums?: Array<{ id: string; title: string }>
//   tracks?: Array<any>
// }

// export default function ArtistPage() {
//   const params = useParams()
//   const artistId = params.id as string
//   const { play } = usePlayer()
//   const [artist, setArtist] = useState<ArtistDetail | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [isFollowing, setIsFollowing] = useState(false)

//   useEffect(() => {
//     async function loadArtist() {
//       try {
//         const data = await getArtistById(artistId)
//         setArtist(data as ArtistDetail)
//       } catch (error) {
//         console.error('Failed to load artist:', error)
//       } finally {
//         setLoading(false)
//       }
//     }
//     if (artistId) {
//       loadArtist()
//     }
//   }, [artistId])

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black p-8 flex items-center justify-center">
//         <div className="text-neutral-400">Loading artist...</div>
//       </div>
//     )
//   }

//   if (!artist) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black p-8 flex items-center justify-center">
//         <div className="text-neutral-400">Artist not found</div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black pb-32">
//       {/* Hero Section with Banner */}
//       <div
//         className="relative h-80 bg-gradient-to-b from-red-600/20 to-transparent"
//         style={{
//           backgroundImage: artist.bannerImage
//             ? `url(${artist.bannerImage})`
//             : undefined,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//         }}
//       >
//         <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
//       </div>

//       {/* Artist Info */}
//       <div className="max-w-4xl mx-auto px-8 -mt-24 relative z-10 mb-12">
//         <div className="flex gap-8 items-end mb-8">
//           {/* Artist Avatar */}
//           <div className="w-48 h-48 relative rounded-full overflow-hidden shadow-lg flex-shrink-0 border-4 border-black">
//             {artist.profileImage ? (
//               <Image
//                 src={artist.profileImage}
//                 alt={artist.user.username}
//                 fill
//                 className="object-cover"
//               />
//             ) : (
//               <div className="w-full h-full bg-gradient-to-br from-neutral-700 to-neutral-900 flex items-center justify-center text-6xl">
//                 👤
//               </div>
//             )}
//           </div>

//           {/* Info */}
//           <div className="pb-4 flex-1">
//             <div className="flex items-center gap-2 mb-2">
//               <h1 className="text-5xl font-bold">{artist.user.username}</h1>
//               {artist.isVerified && <VerifiedBadge />}
//             </div>

//             {artist.bio && (
//               <p className="text-neutral-300 mb-4">{artist.bio}</p>
//             )}

//             <div className="flex gap-6 mb-6 text-sm text-neutral-400">
//               <div>
//                 <span className="font-bold text-white">
//                   {artist.totalFollowers.toLocaleString()}
//                 </span>
//                 {' '}followers
//               </div>
//               <div>
//                 <span className="font-bold text-white">
//                   {artist.totalTracks}
//                 </span>
//                 {' '}tracks
//               </div>
//               <div>
//                 <span className="font-bold text-white">
//                   {(artist.totalStreams / 1000000).toFixed(1)}M
//                 </span>
//                 {' '}streams
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-4">
//               <Button
//                 onClick={() => artist.tracks && artist.tracks.length > 0 && play(artist.tracks[0], artist.tracks)}
//                 className="bg-red-600 hover:bg-red-700 text-white rounded-full px-8"
//               >
//                 <Play className="w-5 h-5 mr-2 fill-white" />
//                 Play
//               </Button>

//               <Button
//                 onClick={() => setIsFollowing(!isFollowing)}
//                 variant={isFollowing ? 'default' : 'outline'}
//                 className="rounded-full px-8"
//               >
//                 {isFollowing ? 'Following' : 'Follow'}
//               </Button>

//               <Button
//                 variant="outline"
//                 className="rounded-full px-4"
//               >
//                 <Share2 className="w-5 h-5" />
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <Tabs defaultValue="popular" className="w-full">
//           <TabsList className="bg-neutral-900 border-b border-neutral-800">
//             <TabsTrigger value="popular">Popular</TabsTrigger>
//             <TabsTrigger value="discography">Discography</TabsTrigger>
//           </TabsList>

//           <TabsContent value="popular" className="mt-8">
//             {artist.tracks && artist.tracks.length > 0 ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//                 {artist.tracks.slice(0, 10).map((track) => (
//                   <TrackCard key={track.id} track={track} />
//                 ))}
//               </div>
//             ) : (
//               <p className="text-neutral-400">No tracks available</p>
//             )}
//           </TabsContent>

//           <TabsContent value="discography" className="mt-8">
//             {artist.albums && artist.albums.length > 0 ? (
//               <div className="space-y-4">
//                 {artist.albums.map((album) => (
//                   <div
//                     key={album.id}
//                     className="bg-neutral-900 rounded-lg p-4 hover:bg-neutral-800 transition flex items-center gap-4"
//                   >
//                     <Music className="w-12 h-12 text-neutral-600" />
//                     <div className="flex-1">
//                       <h3 className="font-semibold">{album.title}</h3>
//                       <p className="text-sm text-neutral-400">Album</p>
//                     </div>
//                     <Button variant="ghost" size="sm">
//                       <Play className="w-5 h-5" />
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-neutral-400">No albums available</p>
//             )}
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   )
// }
