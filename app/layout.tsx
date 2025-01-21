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
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Materials Analysis'
  },
  formatDetection: {
    telephone: false
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ],
  width: 'device-width',
  initialScale: 1
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