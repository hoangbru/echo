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
  let isArtist = false;

  if (user) {
    const [profileResult, artistResult] = await Promise.all([
      UserService.getUserProfileById(supabase, user.id),
      ArtistService.getCurrentArtistProfile(supabase, user.id),
    ]);
    if (profileResult.data) {

      dbProfile = profileResult.data;
    } else if (profileResult.error) {
      console.error(
        "Đã có lỗi xảy ra, vui lòng thử lại sau!",
        profileResult.error,
      );
    }

    if (artistResult.data) {
      isArtist = true;
    } else if (artistResult.error) {
      console.error(
        "Đã có lỗi xảy ra, vui lòng thử lại sau!",
        artistResult.error,
      );
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
