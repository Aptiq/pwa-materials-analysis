"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export function PWAInstallPrompt() {
  const [isInstallable, setIsInstallable] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    })

    window.addEventListener('appinstalled', () => {
      setIsInstallable(false)
      setDeferredPrompt(null)
    })
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setIsInstallable(false)
      }
      setDeferredPrompt(null)
    }
  }

  if (!isInstallable) return null

  return (
    <Button 
      onClick={handleInstall}
      variant="outline"
      size="sm"
      className="fixed bottom-4 right-4 z-50"
    >
      <Download className="mr-2 h-4 w-4" />
      Installer l&apos;application
    </Button>
  )
} 