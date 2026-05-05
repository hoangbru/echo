import { GuestSidebar } from "@/components/layout/sidebar";
import { GuestHeader } from "@/components/layout/navbar";
import { MainWrapper } from "@/components/layout/main-wrapper";
import { GlobalPlayer, QueuePanel } from "@/components/features/player";

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
  let isAdmin = false;

  if (user) {
    const [profileResult, artistResult] = await Promise.all([
      UserService.getUserProfile(supabase, user.id),
      ArtistService.getCurrentArtist(supabase, user.id),
    ]);

    if (profileResult) {
      dbProfile = profileResult;
      if (profileResult.role === "ADMIN") {
        isAdmin = true;
      }
    }

    if (artistResult) {
      isArtist = true;
    }
  }

  return (
    <div>
      <div className="flex h-screen bg-background flex-col lg:flex-row">
        <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
          <GuestSidebar />
        </div>

        <main className="flex-1 flex flex-col min-w-0">
          <GuestHeader
            profile={dbProfile}
            isArtist={isArtist}
            isAdmin={isAdmin}
          />
          <div className="flex-1 overflow-y-auto pb-32">
            <MainWrapper>{children}</MainWrapper>
          </div>
        </main>
      </div>

      <QueuePanel />
      <GlobalPlayer />
    </div>
  );
}
