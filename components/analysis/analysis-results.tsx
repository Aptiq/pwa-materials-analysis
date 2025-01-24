"use client"

import Image from "next/image"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"

interface VisualData {
  image1: string | null
  image2: string | null
  alignedImage: string | null
  keypointsOrigin?: string | null
  keypointsCompared?: string | null
  alignedOrigin?: string | null
  alignedCompared?: string | null
}

interface AnalysisResultsProps {
  matchedZone: Record<string, any> | null
  degradationScore: number | null
  colorDifference: number | null
  visualData: VisualData | null | undefined
}

// Composant d'image sécurisé avec validation plus stricte
const SafeImage = ({ src, alt, ...props }: { src: string | null | undefined, alt: string, [key: string]: any }) => {
  // Validation très stricte de l'URL
  const isValidImageUrl = (url: any): url is string => {
    return Boolean(
      url && 
      typeof url === 'string' && 
      url.trim() !== '' && 
      url !== "{}" && 
      url !== "[object Object]"
    )
  }

  // Si l'URL n'est pas valide, on affiche le placeholder
  if (!isValidImageUrl(src)) {
    return (
      <div className="flex h-full items-center justify-center bg-muted">
        <p className="text-sm text-muted-foreground">Image non disponible</p>
      </div>
    )
  }

  // Si l'URL est valide, on affiche l'image
  try {
    return (
      <Image
        src={src}
        alt={alt}
        {...props}
      />
    )
  } catch (error) {
    return (
      <div className="flex h-full items-center justify-center bg-muted">
        <p className="text-sm text-muted-foreground">Erreur de chargement</p>
      </div>
    )
  }
}

export function AnalysisResults({
  matchedZone = null,
  degradationScore = null,
  colorDifference = null,
  visualData = undefined
}: AnalysisResultsProps) {
  
  // Nettoyage des données d'entrée
  const cleanImageUrl = (url: any): string | null => {
    if (!url || typeof url !== 'string' || url.trim() === '' || url === "{}" || url === "[object Object]") {
      return null
    }
    return url.trim()
  }

  // Préparation des URLs nettoyées
  const cleanOriginImage = cleanImageUrl(matchedZone?.x)
  const cleanComparedImage = cleanImageUrl(matchedZone?.y)
  const cleanVisualData = visualData ? {
    image1: cleanImageUrl(visualData.image1),
    image2: cleanImageUrl(visualData.image2),
    alignedImage: cleanImageUrl(visualData.alignedImage),
    keypointsOrigin: cleanImageUrl(visualData.keypointsOrigin),
    keypointsCompared: cleanImageUrl(visualData.keypointsCompared),
    alignedOrigin: cleanImageUrl(visualData.alignedOrigin),
    alignedCompared: cleanImageUrl(visualData.alignedCompared)
  } : null

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Visualisation des images */}
      <Card>
        <CardHeader>
          <CardTitle>Images comparées</CardTitle>
          <CardDescription>
            Visualisation des deux états de la matière
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Image d'origine */}
            <div className="space-y-2">
              <h3 className="font-medium">État initial</h3>
              <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
                <SafeImage
                  src={cleanOriginImage}
                  alt="Image d'origine"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </div>
            </div>
            
            {/* Image comparée */}
            <div className="space-y-2">
              <h3 className="font-medium">État comparé</h3>
              <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
                <SafeImage
                  src={cleanComparedImage}
                  alt="Image comparée"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Points détectés */}
      {cleanVisualData ? (
        <Card>
          <CardHeader>
            <CardTitle>Points détectés</CardTitle>
            <CardDescription>
              Visualisation des points clés identifiés sur chaque image
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium">État initial</h3>
                <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
                  <SafeImage
                    src={cleanVisualData.image1}
                    alt="Points détectés - État d'origine"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">État comparé</h3>
                <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
                  <SafeImage
                    src={cleanVisualData.image2}
                    alt="Points détectés - État comparé"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Points détectés</CardTitle>
            <CardDescription>
              Visualisation des points clés identifiés sur chaque image
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 items-center justify-center bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Lancez l'analyse pour voir les points détectés
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scores et métriques */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Score de dégradation</CardTitle>
            <CardDescription>
              Évalue le niveau de détérioration entre les deux états
            </CardDescription>
          </CardHeader>
          <CardContent>
            {degradationScore !== null ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Score</span>
                  <span className="font-medium">
                    {degradationScore.toFixed(2)}
                  </span>
                </div>
                <Progress 
                  value={degradationScore * 100} 
                  className="h-2"
                />
                <p className="text-sm text-muted-foreground">
                  {interpretDegradationScore(degradationScore)}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Lancez l'analyse pour obtenir le score de dégradation
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Différence de couleur</CardTitle>
            <CardDescription>
              Mesure l'écart colorimétrique (ΔE) entre les zones analysées
            </CardDescription>
          </CardHeader>
          <CardContent>
            {colorDifference !== null ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>ΔE</span>
                  <span className="font-medium">
                    {colorDifference.toFixed(2)}
                  </span>
                </div>
                <Progress 
                  value={Math.min(colorDifference * 10, 100)} 
                  className="h-2"
                />
                <p className="text-sm text-muted-foreground">
                  {interpretColorDifference(colorDifference)}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Lancez l'analyse pour obtenir la différence de couleur
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function interpretDegradationScore(score: number): string {
  if (score < 0.2) return "Dégradation minime"
  if (score < 0.4) return "Légère dégradation"
  if (score < 0.6) return "Dégradation modérée"
  if (score < 0.8) return "Dégradation importante"
  return "Dégradation sévère"
}

function interpretColorDifference(delta: number): string {
  if (delta < 1) return "Différence imperceptible"
  if (delta < 2) return "Différence très légère"
  if (delta < 5) return "Différence perceptible"
  if (delta < 10) return "Différence significative"
  return "Différence majeure"
}

// Valeurs par défaut pour les props
AnalysisResults.defaultProps = {
  matchedZone: null,
  degradationScore: null,
  colorDifference: null,
  visualData: undefined
} 