import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { PlayerBar } from "@/components/player-bar";
import { PlayerProvider } from "@/lib/contexts/player-context";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PlayerProvider>
      <div className="flex h-screen bg-background flex-col lg:flex-row">
        {/* Sidebar - Hidden on mobile, shown on lg+ */}
        <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0">
          <Header />
          <div className="flex-1 overflow-y-auto pb-32">{children}</div>
        </main>
      </div>

      {/* Player Bar */}
      <PlayerBar />
    </PlayerProvider>
  );
}
