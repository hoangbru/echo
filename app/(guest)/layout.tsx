import { GuestSidebar } from "@/components/guest/guest-sidebar";
import { GuestHeader } from "@/components/guest/guest-header";
import { PlayerBar } from "@/components/guest/player-bar";
import { PlayerProvider } from "@/lib/contexts/player-context";
import { createClient } from "@/lib/supabase/server";
import { getUserProfileById } from "@/lib/services/user.service";

export default async function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let dbProfile = null;
  if (user) {
    dbProfile = await getUserProfileById(user.id);
  }

  let isArtist = false;
  if (user) {
    const { data: artistProfile } = await supabase
      .from("ArtistProfile")
      .select("id")
      .eq("userId", user.id)
      .eq("isVerified", true)
      .single();

    if (artistProfile) {
      isArtist = true;
    }
  }
  const profileData = {
    ...dbProfile,
    isArtist: isArtist, 
  };

  return (
    <PlayerProvider>
      <div className="flex h-screen bg-background flex-col lg:flex-row">
        <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
          <GuestSidebar />
        </div>

        <main className="flex-1 flex flex-col min-w-0">
          <GuestHeader profile={profileData} />
          <div className="flex-1 overflow-y-auto pb-32">{children}</div>
        </main>
      </div>

      <PlayerBar />
    </PlayerProvider>
  );
}
