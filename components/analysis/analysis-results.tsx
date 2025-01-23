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

type AnalysisResult = {
  matchedZone: {
    x: number
    y: number
    width: number
    height: number
  } | null
  degradationScore: number | null
  colorDifference: number | null
}

interface AnalysisResultsProps {
  originImage: string
  comparedImage: string
  results: AnalysisResult
}

export function AnalysisResults({ 
  originImage, 
  comparedImage, 
  results 
}: AnalysisResultsProps) {
  return (
    <div className="grid gap-6">
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
            <div className="space-y-2">
              <h3 className="font-medium">État initial</h3>
              <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
                <Image
                  src={originImage}
                  alt="Image d'origine"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
                {results.matchedZone && (
                  <div 
                    className="absolute border-2 border-green-500 bg-green-500/20"
                    style={{
                      left: `${(results.matchedZone.x / 100) * 100}%`,
                      top: `${(results.matchedZone.y / 100) * 100}%`,
                      width: `${(results.matchedZone.width / 100) * 100}%`,
                      height: `${(results.matchedZone.height / 100) * 100}%`,
                    }}
                  />
                )}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">État comparé</h3>
              <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
                <Image
                  src={comparedImage}
                  alt="Image comparée"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {results.matchedZone && (
                  <div 
                    className="absolute border-2 border-green-500 bg-green-500/20"
                    style={{
                      left: `${(results.matchedZone.x / 100) * 100}%`,
                      top: `${(results.matchedZone.y / 100) * 100}%`,
                      width: `${(results.matchedZone.width / 100) * 100}%`,
                      height: `${(results.matchedZone.height / 100) * 100}%`,
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
            {results.degradationScore !== null ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Score</span>
                  <span className="font-medium">
                    {results.degradationScore.toFixed(2)}
                  </span>
                </div>
                <Progress 
                  value={results.degradationScore * 100} 
                  className="h-2"
                />
                <p className="text-sm text-muted-foreground">
                  {interpretDegradationScore(results.degradationScore)}
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
            {results.colorDifference !== null ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>ΔE</span>
                  <span className="font-medium">
                    {results.colorDifference.toFixed(2)}
                  </span>
                </div>
                <Progress 
                  value={Math.min(results.colorDifference * 10, 100)} 
                  className="h-2"
                />
                <p className="text-sm text-muted-foreground">
                  {interpretColorDifference(results.colorDifference)}
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