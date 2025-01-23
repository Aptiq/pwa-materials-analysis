"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { toast } from "sonner"
import Script from 'next/script'

declare global {
  interface Window {
    cv: any
    Module: any
  }
}

const CvContext = createContext<boolean>(false)

export function CvProvider({ children }: { children: React.ReactNode }) {
  const [cvReady, setCvReady] = useState(false)

  useEffect(() => {
    // Configuration du module OpenCV
    window.Module = {
      onRuntimeInitialized: () => {
        console.log('OpenCV Runtime initialisé')
        setCvReady(true)
        toast.success('OpenCV chargé avec succès')
      }
    }
  }, [])

  return (
    <CvContext.Provider value={cvReady}>
      <Script
        src="https://docs.opencv.org/4.8.0/opencv.js"
        strategy="beforeInteractive"
        onLoad={() => {
          console.log('Script OpenCV chargé')
        }}
        onError={(e) => {
          console.error('Erreur de chargement OpenCV:', e)
          toast.error('Erreur lors du chargement d\'OpenCV')
        }}
      />
      {children}
    </CvContext.Provider>
  )
}

export function useCv() {
  const ready = useContext(CvContext)
  return ready
} 