// 'use client'

// import { useEffect, useState } from 'react'
// import { getTrendingTracks, getTrendingArtists } from '@/lib/api-client'
// import { TrackCard } from '@/components/track-card'
// import { ArtistCard } from '@/components/artist-card'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// interface Track {
//   id: string
//   title: string
//   artist: { username: string } & any
//   duration: number
//   audioUrl: string
//   coverImage?: string
//   totalStreams?: number
// }

// interface Artist {
//   id: string
//   user: { username: string } & any
//   totalFollowers: number
//   isVerified: boolean
//   totalStreams?: number
// }

// export default function TrendingPage() {
//   const [tracks, setTracks] = useState<Track[]>([])
//   const [artists, setArtists] = useState<Artist[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     async function loadTrending() {
//       try {
//         const [tracksData, artistsData] = await Promise.all([
//           getTrendingTracks(50),
//           getTrendingArtists(20),
//         ])
//         setTracks(tracksData || [])
//         setArtists(artistsData || [])
//       } catch (error) {
//         console.error('Failed to load trending data:', error)
//       } finally {
//         setLoading(false)
//       }
//     }
//     loadTrending()
//   }, [])

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black p-8">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-4xl font-bold mb-8">What's Trending</h1>

//         <Tabs defaultValue="tracks" className="w-full">
//           <TabsList className="bg-neutral-900 border-b border-neutral-800">
//             <TabsTrigger value="tracks">Trending Tracks</TabsTrigger>
//             <TabsTrigger value="artists">Trending Artists</TabsTrigger>
//           </TabsList>

//           <TabsContent value="tracks" className="mt-8">
//             {loading ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//                 {[...Array(15)].map((_, i) => (
//                   <div key={i} className="bg-neutral-800 rounded-lg h-64 animate-pulse" />
//                 ))}
//               </div>
//             ) : tracks.length > 0 ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//                 {tracks.map((track, idx) => (
//                   <div key={track.id} className="relative">
//                     <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold z-10">
//                       #{idx + 1}
//                     </div>
//                     <TrackCard track={track} />
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-neutral-400">No trending tracks available</p>
//             )}
//           </TabsContent>

//           <TabsContent value="artists" className="mt-8">
//             {loading ? (
//               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//                 {[...Array(12)].map((_, i) => (
//                   <div key={i} className="bg-neutral-800 rounded-lg h-40 animate-pulse" />
//                 ))}
//               </div>
//             ) : artists.length > 0 ? (
//               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//                 {artists.map((artist) => (
//                   <ArtistCard key={artist.id} artist={artist} />
//                 ))}
//               </div>
//             ) : (
//               <p className="text-neutral-400">No trending artists available</p>
//             )}
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   )
// }
