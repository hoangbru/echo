import { GlobalPlayer, QueuePanel } from "@/components/features/player";
import { ListenerWrapper } from "@/components/layout";
import { AuthModal } from "@/components/shared/modals";

export default async function ListenerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <ListenerWrapper>{children}</ListenerWrapper>

      <AuthModal />
      <QueuePanel />
      <GlobalPlayer />
    </div>
  );
}
