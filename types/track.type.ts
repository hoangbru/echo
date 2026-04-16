export interface Track {
  id: string;
  title: string;
  duration: number;
  audioUrl: string | null;
  imageUrl: string | null;
  artistId: string | null;
  albumId: string | null;
}
