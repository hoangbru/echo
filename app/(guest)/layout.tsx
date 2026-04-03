import { GuestSidebar } from "@/components/guest-sidebar";
import { GuestHeader } from "@/components/guest-header";
import { PlayerBar } from "@/components/player-bar";
import { PlayerProvider } from "@/lib/contexts/player-context";
import { createClient } from "@/lib/supabase/server";

export default async function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <PlayerProvider>
      <div className="flex h-screen bg-background flex-col lg:flex-row">
        {/* Sidebar - Hidden on mobile, shown on lg+ */}
        <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
          <GuestSidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0">
          <GuestHeader user={user} />
          <div className="flex-1 overflow-y-auto pb-32">{children}</div>
        </main>
      </div>

      {/* Player Bar */}
      <PlayerBar />
    </PlayerProvider>
  );
}
