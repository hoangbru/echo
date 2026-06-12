import type { Metadata } from "next";
import { Geist } from "next/font/google";

import "./globals.css";
import {
  ModalProvider,
  QueryProvider,
  ThemeProvider,
} from "@/components/providers";
import { AuthProvider } from "@/hooks/use-auth";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Echo - Music Streaming Platform",
  description:
    "Stream your favorite music with Echo. Discover artists, create playlists, and enjoy unlimited music.",
  generator: ".app",
  icons: {
    icon: "/ico/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geist.className} font-sans antialiased bg-background text-foreground`}
      >
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
          >
            <AuthProvider>
              <ModalProvider />
              {children}
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
