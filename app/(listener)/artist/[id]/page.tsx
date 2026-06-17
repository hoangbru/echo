import { ArtistDetailContainer } from "@/components/features/listener/artist-detail";

export default async function ArtistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ArtistDetailContainer artistId={id} />;
}
