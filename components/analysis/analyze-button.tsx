"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useCv } from "@/components/cv-provider"

interface AnalyzeButtonProps {
  analysisId: string
  disabled?: boolean
}

export function AnalyzeButton({ analysisId, disabled }: AnalyzeButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const cvReady = useCv()

  console.log('État du bouton:', { cvReady, loading, disabled })

  async function startAnalysis() {
    if (!cvReady) {
      toast.error("OpenCV n'est pas encore chargé. Veuillez patienter.")
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/analyses/${analysisId}/analyze`, {
        method: "POST"
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'analyse")
      }

      toast.success("Analyse effectuée avec succès")
      router.refresh()
    } catch (error) {
      console.error("Erreur:", error)
      toast.error(error instanceof Error ? error.message : "L'analyse a échoué. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Button 
        onClick={startAnalysis} 
        disabled={disabled || loading || !cvReady}
        className="relative"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyse en cours...
          </>
        ) : !cvReady ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Chargement d'OpenCV...
          </>
        ) : (
          "Lancer l'analyse"
        )}
      </Button>
      {!cvReady && (
        <p className="text-sm text-muted-foreground">
          Chargement de la bibliothèque d'analyse d'image...
        </p>
      )}
    </div>
  )
} 