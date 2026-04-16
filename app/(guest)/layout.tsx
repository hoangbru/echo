import { GuestSidebar } from "@/components/guest/guest-sidebar";
import { GuestHeader } from "@/components/guest/guest-header";
import { PlayerBar } from "@/components/guest/player-bar";
import { PlayerProvider } from "@/lib/contexts/player-context";
import { createClient } from "@/lib/supabase/server";
import { UserService } from "@/lib/services/user.service";
import { ArtistService } from "@/lib/services/artist.service";

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
    dbProfile = await UserService.getUserProfileById(user.id);
  }

  let isArtist = false;
  if (user) {
    const artistProfile = await ArtistService.getCurrentArtistProfile();

    if (artistProfile) {
      isArtist = true;
    }
  }

  return (
    <PlayerProvider>
      <div className="flex h-screen bg-background flex-col lg:flex-row">
        <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
          <GuestSidebar />
        </div>

        <main className="flex-1 flex flex-col min-w-0">
          <GuestHeader profile={dbProfile} isArtist={isArtist} />
          <div className="flex-1 overflow-y-auto pb-32">{children}</div>
        </main>
      </div>

      <PlayerBar />
    </PlayerProvider>
  );
}
