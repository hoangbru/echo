import { createClient } from '@/lib/supabase/client'

// ==================== Track API ====================

export async function getTracks(limit = 20, offset = 0) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('Track')
    .select(`
      *,
      artist:ArtistProfile(*),
      album:Album(id, title, coverImage)
    `)
    .eq('isPublished', true)
    .order('releaseDate', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return data
}

export async function getTrackById(trackId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('Track')
    .select(`
      *,
      artist:ArtistProfile(*),
      album:Album(*),
      genre:Genre(*)
    `)
    .eq('id', trackId)
    .eq('isPublished', true)
    .single()

  if (error) throw error
  return data
}

export async function searchTracks(query: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('Track')
    .select(`
      *,
      artist:ArtistProfile(*),
      album:Album(id, title, coverImage)
    `)
    .eq('isPublished', true)
    .or(`title.ilike.%${query}%,artist.username.ilike.%${query}%`)
    .limit(20)

  if (error) throw error
  return data
}

// ==================== Album API ====================

export async function getAlbums(limit = 20, offset = 0) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('Album')
    .select(`
      *,
      artist:ArtistProfile(*),
      genre:Genre(*)
    `)
    .eq('isPublished', true)
    .order('releaseDate', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return data
}

export async function getAlbumById(albumId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('Album')
    .select(`
      *,
      artist:ArtistProfile(*),
      genre:Genre(*),
      tracks:Track(
        *,
        artist:ArtistProfile(*)
      )
    `)
    .eq('id', albumId)
    .eq('isPublished', true)
    .single()

  if (error) throw error
  return data
}

// ==================== Artist API ====================

export async function getArtistById(artistId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('ArtistProfile')
    .select(`
      *,
      user:User(id, username, email, avatar),
      albums:Album(
        *,
        tracks:Track(id, title, duration)
      ),
      tracks:Track(*)
    `)
    .eq('id', artistId)
    .single()

  if (error) throw error
  return data
}

export async function searchArtists(query: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('ArtistProfile')
    .select(`
      *,
      user:User(username)
    `)
    .eq('isVerified', true)
    .or(`user.username.ilike.%${query}%`)
    .limit(10)

  if (error) throw error
  return data
}

// ==================== Playlist API ====================

export async function getPlaylistById(playlistId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('Playlist')
    .select(`
      *,
      user:User(*),
      items:PlaylistItem(
        *,
        track:Track(
          *,
          artist:ArtistProfile(*)
        )
      )
    `)
    .eq('id', playlistId)
    .single()

  if (error) throw error
  return data
}

export async function getUserPlaylists(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('Playlist')
    .select(`
      *,
      items:PlaylistItem(id)
    `)
    .eq('userId', userId)
    .order('createdAt', { ascending: false })

  if (error) throw error
  return data
}

// ==================== Genre API ====================

export async function getGenres() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('Genre')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return data
}

export async function getTracksByGenre(genreId: string, limit = 20, offset = 0) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('Track')
    .select(`
      *,
      artist:ArtistProfile(*),
      album:Album(id, title, coverImage)
    `)
    .eq('genreId', genreId)
    .eq('isPublished', true)
    .order('releaseDate', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return data
}

// ==================== Stream History ====================

export async function recordStreamHistory(userId: string, trackId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('StreamHistory')
    .insert([{ userId, trackId, streamedAt: new Date().toISOString() }])

  if (error) throw error
  return data
}

export async function getUserStreamHistory(userId: string, limit = 50) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('StreamHistory')
    .select(`
      *,
      track:Track(
        *,
        artist:ArtistProfile(*)
      )
    `)
    .eq('userId', userId)
    .order('streamedAt', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

// ==================== Favorites & Likes ====================

export async function addToFavorites(userId: string, trackId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('Favorite')
    .insert([{ userId, trackId }])
    .select()

  if (error) throw error
  return data
}

export async function removeFromFavorites(userId: string, trackId: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('Favorite')
    .delete()
    .eq('userId', userId)
    .eq('trackId', trackId)

  if (error) throw error
}

export async function getUserFavorites(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('Favorite')
    .select(`
      track:Track(
        *,
        artist:ArtistProfile(*)
      )
    `)
    .eq('userId', userId)
    .order('createdAt', { ascending: false })

  if (error) throw error
  return data
}

// ==================== Trending ====================

export async function getTrendingTracks(limit = 20) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('Track')
    .select(`
      *,
      artist:ArtistProfile(*),
      album:Album(id, title, coverImage)
    `)
    .eq('isPublished', true)
    .order('totalStreams', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

export async function getTrendingArtists(limit = 10) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('ArtistProfile')
    .select(`
      *,
      user:User(username)
    `)
    .eq('isVerified', true)
    .order('totalFollowers', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}
