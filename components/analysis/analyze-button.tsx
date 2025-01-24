"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Search } from "lucide-react"
import { useCv } from "@/components/cv-provider"
import { detectKeypoints, matToBase64, analyzeImages, AnalysisResult } from "@/lib/image-analysis"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { VisualData } from "@/types/analysis"
import { cn } from "@/lib/utils"

// Déclaration du type OpenCV
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
  const cv = useCv() as typeof window.cv
  const router = useRouter()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [visualData, setVisualData] = useState<{
    original1: string;
    original2: string;
    aligned: string;
  } | null>(existingResults?.visualData ? {
    original1: existingResults.visualData.image1,
    original2: existingResults.visualData.image2,
    aligned: existingResults.visualData.alignedImage
  } : null)
  const [score, setScore] = useState<number | null>(
    existingResults?.degradationScore || null
  )

  const analyze = useCallback(async () => {
    if (!cv || !originImageUrl || !comparedImageUrl) {
      toast.error("Images non disponibles")
      return
    }

    try {
      setLoading(true)
      setIsAnalyzing(true)
      setError(null)

      // Charger les images
      const [img1, img2] = await Promise.all([
        loadImage(originImageUrl),
        loadImage(comparedImageUrl)
      ])

      // Convertir les images en matrices OpenCV
      const mat1 = cv.imread(img1)
      const mat2 = cv.imread(img2)

      // Analyser les images
      const result = await analyzeImages(mat1, mat2)

      if (result.error) {
        setError(result.error)
        return
      }

      // Mettre à jour l'interface avec les résultats
      if (result.visualData) {
        setVisualData({
          original1: result.visualData.image1,
          original2: result.visualData.image2,
          aligned: result.visualData.alignedImage
        })
      }

      if (result.degradationScore !== undefined) {
        setScore(result.degradationScore)
      }

      // Préparer les données à sauvegarder
      const dataToSave = {
        ...result,
        visualData: {
          ...result.visualData,
          image1: result.visualData.image1,
          image2: result.visualData.image2,
          alignedImage: result.visualData.alignedImage,
          keypointsOrigin: result.visualData.keypointsOrigin || result.visualData.image1,
          keypointsCompared: result.visualData.keypointsCompared || result.visualData.image2
        }
      }

      // Sauvegarder les résultats
      const response = await fetch(`/api/analyses/${analysisId}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave)
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.details || 'Erreur lors de la sauvegarde des résultats')
      }

      // Mettre à jour l'état local avec les données complètes
      setResults(responseData.analysis)
      setVisualData({
        original1: responseData.analysis.visualData.image1,
        original2: responseData.analysis.visualData.image2,
        aligned: responseData.analysis.visualData.alignedImage
      })
      
      if (responseData.analysis.degradationScore !== undefined) {
        setScore(responseData.analysis.degradationScore)
      }

      toast.success("Analyse terminée et sauvegardée")
      router.refresh()

    } catch (error) {
      console.error("Erreur lors de l'analyse:", error)
      setError(error instanceof Error ? error.message : "Une erreur est survenue")
      toast.error("Une erreur est survenue lors de l'analyse")
    } finally {
      // Nettoyer les matrices OpenCV
      if (cv) {
        mat1?.delete()
        mat2?.delete()
      }
      setIsAnalyzing(false)
      setLoading(false)
    }
  }, [cv, originImageUrl, comparedImageUrl, analysisId, router])

  const isAnalyzed = Boolean(existingResults?.visualData)

  return (
    <div className="space-y-4">
      <Button 
        onClick={analyze}
        disabled={disabled || loading || !originImageUrl || !comparedImageUrl}
        className={cn("min-w-[140px]", {
          "opacity-50 cursor-not-allowed": disabled || !originImageUrl || !comparedImageUrl
        })}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyse en cours...
          </>
        ) : existingResults ? (
          <>
            <Search className="mr-2 h-4 w-4" />
            Relancer l'analyse
          </>
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" />
            Lancer l'analyse
          </>
        )}
      </Button>

      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}

      {visualData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Image 1 (référence)</h3>
            <img src={visualData.original1} alt="Image 1 avec points clés" className="w-full" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Image 2 (alignée)</h3>
            <img src={visualData.aligned} alt="Image 2 alignée" className="w-full" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Image 2 (originale)</h3>
            <img src={visualData.original2} alt="Image 2 avec points clés" className="w-full" />
          </div>
        </div>
      )}

      {score !== null && (
        <div className="text-center">
          <h3 className="text-lg font-medium">Score de dégradation</h3>
          <p className="text-3xl font-bold">{(score * 100).toFixed(1)}%</p>
        </div>
      )}
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