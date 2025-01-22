import './globals.css';
import { ThemeProvider } from "@/components/theme-provider"
import { type Metadata, type Viewport } from 'next'
import { Inter } from 'next/font/google';
import { SiteHeader } from "@/components/site-header"
import { Toaster } from "@/components/ui/toaster"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PWA Materials Analysis',
  description: 'Analyse de matériaux',
  manifest: '/manifest.json',
  icons: {
    apple: [
      { url: '/icons/apple-icon-180.png', sizes: '180x180', type: 'image/png' },
      { url: '/icons/apple-icon-152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/apple-icon-120.png', sizes: '120x120', type: 'image/png' }
    ],
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' }
    ]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    startupImage: [
      {
        url: '/icons/apple-icon-180.png',
        media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)'
      }
    ],
    title: 'Materials Analysis'
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Materials Analysis',
    'mobile-web-app-capable': 'yes'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col bg-background">
            <SiteHeader />
            <main className="flex-1">
              <div className="container relative">
                {children}
              </div>
            </main>
            <footer className="border-t py-6 md:py-0">
              <div className="container flex h-14 items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  © {new Date().getFullYear()} Votre App. Tous droits réservés.
                </p>
              </div>
            </footer>
          </div>
          <Toaster />
          <PWAInstallPrompt />
        </ThemeProvider>
      </body>
    </html>
  );
}