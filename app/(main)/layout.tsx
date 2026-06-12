import { GuestSidebar } from "@/components/layout/sidebar";
import { GuestHeader } from "@/components/layout/navbar";
import { MainWrapper } from "@/components/layout/main-wrapper";
import { GlobalPlayer, QueuePanel } from "@/components/features/player";
import { AuthModal } from "@/components/shared/modals";

export default async function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex h-screen bg-background flex-col lg:flex-row">
        <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
          <GuestSidebar />
        </div>

        <main className="flex-1 flex flex-col min-w-0">
          <GuestHeader />
          <div className="flex-1 overflow-y-auto pb-32">
            <MainWrapper>{children}</MainWrapper>
          </div>
        </main>
      </div>

      <AuthModal />
      <QueuePanel />
      <GlobalPlayer />
    </div>
  );
}
