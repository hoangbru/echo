import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { PlayerBar } from '@/components/player-bar'
import { PlayerProvider } from '@/lib/contexts/player-context'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Echo - Music Streaming Platform',
  description: 'Stream your favorite music with Echo. Discover artists, create playlists, and enjoy unlimited music.',
  generator: '.app',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.className} font-sans antialiased bg-background text-foreground`}>
        {children}
      </body>
    </html>
  )
}
