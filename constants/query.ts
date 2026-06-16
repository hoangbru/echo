export const TRACK_SELECT = `
  id,
  title,
  duration,
  audio_url,
  image_url,
  is_explicit,
  is_published,
  total_streams,
  slug,
  lyrics,
  created_at,
  album(id, title, cover_image),
  genre(id, name),
  track_artists(is_main, artist(id, stage_name, profile_image))
` as const;
