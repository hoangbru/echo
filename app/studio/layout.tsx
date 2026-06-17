import { ReactNode } from "react";

import { StudioShell } from "@/components/features/studio";

export default async function StudioLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <StudioShell>{children}</StudioShell>;
}
