import { authorizeApi } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { keysToCamel } from "@/lib/utils/format";
import { ArtistRequestStatus, UserRole } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = createClient();

    const auth = await authorizeApi();
    const role = auth.error ? "GUEST" : auth.role;
    const currentArtistId = auth.artistId;

    const { data, error } = await supabase
      .from("artist_request")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) throw new Error("Không tìm thấy Album");

    if (!data.is_published) {
      const isOwner =
        role === UserRole.ARTIST && data.artist_id === currentArtistId;
      const isAdmin = role === UserRole.ADMIN;

      if (!isOwner && !isAdmin) {
        return NextResponse.json(
          { error: "Album này đang ở chế độ riêng tư." },
          { status: 403 },
        );
      }
    }

    const formattedData = keysToCamel(data);

    return NextResponse.json({ data: formattedData }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}