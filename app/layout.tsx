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
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Materials Analysis',
    startupImage: [
      {
        url: '/splash/apple-splash-2048-2732.jpg',
        media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)'
      }
    ]
  },
  formatDetection: {
    telephone: false
  },
  icons: {
    apple: [
      { url: '/icons/apple-icon-180.png', sizes: '180x180', type: 'image/png' },
      { url: '/icons/apple-icon-152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/apple-icon-120.png', sizes: '120x120', type: 'image/png' }
    ]
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ],
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