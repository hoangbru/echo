import { redirect } from "next/navigation";

import { ArtistShell } from "@/components/artist/artist-shell";

import { ArtistService } from "@/lib/services";
import { createClient } from "@/lib/supabase/server";

export default async function ArtistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const {data: artistProfile} = await ArtistService.getCurrentArtistProfile(supabase, user.id);

  if (!artistProfile || !artistProfile.is_verified) {
    redirect("/403");
  }

  return <ArtistShell profile={artistProfile}>{children}</ArtistShell>;
}
