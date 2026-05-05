import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { ArtistShell } from "@/components/features/artist";

import { ArtistService, UserService } from "@/lib/services";
import { createClient } from "@/lib/supabase/server";
import { UserRole } from "@/types";

export default async function ArtistLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  let artistProfile = null;
  let isArtist = false;

  if (user) {
    const [profileResult, artistResult] = await Promise.all([
      UserService.getUserProfile(supabase, user.id),
      ArtistService.getCurrentArtist(supabase, user.id),
    ]);

    if (profileResult.role === UserRole.ARTIST && artistResult) {
      isArtist = true;
      artistProfile = artistResult;
    }
  }

  if (!artistProfile) {
    redirect("/403");
  }

  return <ArtistShell profile={artistProfile}>{children}</ArtistShell>;
}
