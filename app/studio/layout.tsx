import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { ArtistShell } from "@/components/features/artist";

import { ArtistService } from "@/lib/services";
import { createClient } from "@/lib/supabase/server";

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

  const artistProfile = await ArtistService.getCurrentArtist(supabase, user.id);

  if (!artistProfile) {
    redirect("/403");
  }

  return <ArtistShell profile={artistProfile}>{children}</ArtistShell>;
}
