import { PlaylistDetailContainer } from "@/components/features/guest/playlist";

export default async function PlaylistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <PlaylistDetailContainer playlistId={id} />;
}
