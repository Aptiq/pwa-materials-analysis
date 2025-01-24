"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useCv } from "@/components/cv-provider"
import { detectKeypoints, matToBase64 } from "@/lib/image-analysis"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { VisualData } from "@/types/analysis"

// Déclaration du type global pour TypeScript
declare global {
  interface Window {
    cv: any
  }
}

interface DetectionResult {
  keypoints: cv.KeyPointVector;
  descriptors: cv.Mat;
  visualResult: cv.Mat;
}

interface AnalyzeButtonProps {
  analysisId: string
  disabled?: boolean
  originImageUrl: string | null
  comparedImageUrl: string | null
  existingResults?: {
    matchedZone: any
    degradationScore: number | null
    colorDifference: number | null
    visualData: VisualData | null
  } | null
}

export function AnalyzeButton({ 
  analysisId, 
  disabled,
  originImageUrl,
  comparedImageUrl,
  existingResults
}: AnalyzeButtonProps) {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(existingResults)
  const cvReady = useCv()
  const router = useRouter()

  const handleAnalyze = async () => {
    if (!cvReady || !originImageUrl || !comparedImageUrl) {
      toast.error("OpenCV n'est pas encore prêt")
      return
    }
    
    setLoading(true)
    try {
      console.log("Début de l'analyse...")
      
      // Charger les images
      const [img1, img2] = await Promise.all([
        loadImage(originImageUrl),
        loadImage(comparedImageUrl)
      ])
      
      const mat1 = window.cv.imread(img1)
      const mat2 = window.cv.imread(img2)
      
      // Détecter les points clés
      const result1 = await detectKeypoints(mat1) as DetectionResult
      const result2 = await detectKeypoints(mat2) as DetectionResult
      
      // Convertir les visualisations en base64
      const visual1 = matToBase64(result1.visualResult)
      const visual2 = matToBase64(result2.visualResult)
      
      const newVisualData = {
        originalKeypoints: visual1,
        comparedKeypoints: visual2,
        originalCount: result1.keypoints.size(),
        comparedCount: result2.keypoints.size()
      }

      const newResults = {
        matchedZone: { x: 0, y: 0, width: 100, height: 100 }, // exemple
        degradationScore: 75,
        colorDifference: 0.85,
        visualData: newVisualData
      }

      // Sauvegarder les résultats
      const response = await fetch(`/api/analyses/${analysisId}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newResults)
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde des résultats')
      }

      // Mettre à jour l'état local
      setResults(newResults)
      
      toast.success("Analyse terminée et sauvegardée")
      router.refresh()
    } catch (error) {
      console.error("Erreur:", error)
      toast.error("Erreur lors de l'analyse")
    } finally {
      setLoading(false)
    }
  }

  const isAnalyzed = !!results

  return (
    <div className="flex justify-end">
      <Button 
        onClick={handleAnalyze}
        disabled={disabled || loading || !cvReady || !originImageUrl || !comparedImageUrl || isAnalyzed}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? "Analyse en cours..." : isAnalyzed ? "Analyse terminée" : "Analyser"}
      </Button>
    </div>
  )
}

// Fonction utilitaire pour charger une image
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}