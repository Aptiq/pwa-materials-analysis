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
    const checkCv = setInterval(() => {
      if (window.cv) {
        console.log('OpenCV est disponible')
        setCvReady(true)
        clearInterval(checkCv)
        toast.success('OpenCV chargé avec succès')
      }
    }, 100)

    return () => clearInterval(checkCv)
  }, [])

  return (
    <CvContext.Provider value={cvReady}>
      <Script
        src="https://docs.opencv.org/4.8.0/opencv.js"
        strategy="afterInteractive"
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
  return useContext(CvContext)
} 