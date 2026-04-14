import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ArtistShell } from "@/components/artist/artist-shell";

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

  const { data: artistProfile } = await supabase
    .from("ArtistProfile")
    .select("*, User:userId(fullName, avatar, email)")
    .eq("userId", user.id)
    .single();

  if (!artistProfile || !artistProfile.isVerified) {
    redirect("/403");
  }

  const profileData = {
    fullName: artistProfile.User.fullName,
    avatar: artistProfile.profileImage || artistProfile.User.avatar,
    email: artistProfile.User.email,
  };

  return <ArtistShell profile={profileData}>{children}</ArtistShell>;
}
