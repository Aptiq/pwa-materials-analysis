"use client"

import { Card } from "@/components/ui/card"
import Image from "next/image"

interface KeypointsVisualizationProps {
  originalImage: string
  comparedImage: string
  originalKeypoints: string
  comparedKeypoints: string
  originalCount: number
  comparedCount: number
}

export function KeypointsVisualization({
  originalImage,
  comparedImage,
  originalKeypoints,
  comparedKeypoints,
  originalCount,
  comparedCount
}: KeypointsVisualizationProps) {
  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold">Détection des points clés</h3>
        <p className="text-sm text-muted-foreground">
          Points détectés : {originalCount} (original) / {comparedCount} (comparé)
        </p>
      </div>

      {/* Images originales */}
      <div className="space-y-4">
        <h4 className="font-medium">Images sources</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={originalImage}
                alt="Image originale"
                fill
                className="object-cover"
              />
            </div>
            <p className="mt-2 text-sm text-center text-muted-foreground">
              Image originale
            </p>
          </Card>
          
          <Card className="p-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={comparedImage}
                alt="Image comparée"
                fill
                className="object-cover"
              />
            </div>
            <p className="mt-2 text-sm text-center text-muted-foreground">
              Image comparée
            </p>
          </Card>
        </div>
      </div>

      {/* Points clés détectés */}
      <div className="space-y-4">
        <h4 className="font-medium">Points clés détectés</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={originalKeypoints}
                alt="Points clés - Image originale"
                fill
                className="object-cover"
              />
            </div>
            <p className="mt-2 text-sm text-center text-muted-foreground">
              {originalCount} points clés détectés
            </p>
          </Card>
          
          <Card className="p-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={comparedKeypoints}
                alt="Points clés - Image comparée"
                fill
                className="object-cover"
              />
            </div>
            <p className="mt-2 text-sm text-center text-muted-foreground">
              {comparedCount} points clés détectés
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
} 