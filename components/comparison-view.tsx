import Image from 'next/image'
import type { MatchedZone, AnalysisResults } from '@/types/analysis'

interface ComparisonViewProps {
  originImage: string
  comparedImage: string
  results: AnalysisResults
}

export function ComparisonView({ originImage, comparedImage, results }: ComparisonViewProps) {
  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="relative">
        <Image
          src={originImage}
          alt="Image originale"
          width={500}
          height={500}
          className="w-full h-auto"
        />
        {results.matchedZone && (
          <div
            className="absolute border-2 border-red-500"
            style={{
              left: `${results.matchedZone.x}%`,
              top: `${results.matchedZone.y}%`,
              width: `${results.matchedZone.width}%`,
              height: `${results.matchedZone.height}%`,
            }}
          />
        )}
      </div>
      <div>
        <Image
          src={comparedImage}
          alt="Image comparée"
          width={500}
          height={500}
          className="w-full h-auto"
        />
        <div className="mt-4 space-y-2">
          <p className="text-sm">
            Score de dégradation : {results.degradationScore.toFixed(2)}%
          </p>
          <p className="text-sm">
            Différence de couleur : {results.colorDifference.toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  )
} 