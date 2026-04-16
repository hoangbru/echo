// 'use client'

// import { useEffect, useState } from 'react'
// import { useSearchParams } from 'next/navigation'
// import { searchTracks, searchArtists } from '@/lib/api-client'
// import { TrackCard } from '@/components/track-card'
// import { ArtistCard } from '@/components/artist-card'
// import { Input } from '@/components/ui/input'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { Search as SearchIcon } from 'lucide-react'

// interface Track {
//   id: string
//   title: string
//   artist: { username: string } & any
//   duration: number
//   audioUrl: string
//   coverImage?: string
// }

// interface Artist {
//   id: string
//   user: { username: string }
//   profileImage?: string
//   totalFollowers: number
//   isVerified: boolean
// }

// export default function SearchPage() {
//   const searchParams = useSearchParams()
//   const initialQuery = searchParams.get('q') || ''
  
//   const [query, setQuery] = useState(initialQuery)
//   const [tracks, setTracks] = useState<Track[]>([])
//   const [artists, setArtists] = useState<Artist[]>([])
//   const [loading, setLoading] = useState(false)

//   useEffect(() => {
//     if (!query.trim()) {
//       setTracks([])
//       setArtists([])
//       return
//     }

//     async function performSearch() {
//       try {
//         setLoading(true)
//         const [tracksData, artistsData] = await Promise.all([
//           searchTracks(query),
//           searchArtists(query),
//         ])
//         setTracks(tracksData || [])
//         setArtists(artistsData || [])
//       } catch (error) {
//         console.error('Search failed:', error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     const timer = setTimeout(performSearch, 300)
//     return () => clearTimeout(timer)
//   }, [query])

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Search Bar */}
//         <div className="mb-8">
//           <div className="relative">
//             <SearchIcon className="absolute left-3 top-3 w-5 h-5 text-neutral-400" />
//             <Input
//               type="search"
//               placeholder="Search for songs, artists, albums..."
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               className="pl-10 py-3 bg-neutral-800 border-neutral-700 text-lg"
//             />
//           </div>
//         </div>

//         {query.trim() ? (
//           <Tabs defaultValue="tracks" className="w-full">
//             <TabsList className="bg-neutral-900 border-b border-neutral-800">
//               <TabsTrigger value="tracks">
//                 Songs ({tracks.length})
//               </TabsTrigger>
//               <TabsTrigger value="artists">
//                 Artists ({artists.length})
//               </TabsTrigger>
//             </TabsList>

//             <TabsContent value="tracks" className="mt-8">
//               {loading ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//                   {[...Array(10)].map((_, i) => (
//                     <div key={i} className="bg-neutral-800 rounded-lg h-64 animate-pulse" />
//                   ))}
//                 </div>
//               ) : tracks.length > 0 ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//                   {tracks.map((track) => (
//                     <TrackCard key={track.id} track={track} />
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-neutral-400">No songs found matching "{query}"</p>
//               )}
//             </TabsContent>

//             <TabsContent value="artists" className="mt-8">
//               {loading ? (
//                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//                   {[...Array(12)].map((_, i) => (
//                     <div key={i} className="bg-neutral-800 rounded-lg h-40 animate-pulse" />
//                   ))}
//                 </div>
//               ) : artists.length > 0 ? (
//                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//                   {artists.map((artist) => (
//                     <ArtistCard key={artist.id} artist={artist} />
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-neutral-400">No artists found matching "{query}"</p>
//               )}
//             </TabsContent>
//           </Tabs>
//         ) : (
//           <div className="text-center py-12">
//             <SearchIcon className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
//             <h2 className="text-2xl font-semibold mb-2">Start searching</h2>
//             <p className="text-neutral-400">
//               Search for songs, artists, or albums to get started
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
