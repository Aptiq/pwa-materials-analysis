import './globals.css';
import { ThemeProvider } from "@/components/theme-provider"
import { type Metadata, type Viewport } from 'next'
import { Inter } from 'next/font/google';
import { SiteHeader } from "@/components/site-header"
import { Toaster } from "@/components/ui/toaster"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import { CvProvider } from "@/components/cv-provider"

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
    ]
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Materials Analysis" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-icon-180.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-icon-152.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/icons/apple-icon-120.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CvProvider>
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
          </CvProvider>
          <Toaster />
          <PWAInstallPrompt />
        </ThemeProvider>
      </body>
    </html>
  );
}