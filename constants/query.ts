export const TRACK_SELECT = `
  id, title, audio_url, image_url, duration, is_explicit,
  album(id, title, cover_image),
  track_artists(is_main, artist(id, stage_name, profile_image))
` as const;
