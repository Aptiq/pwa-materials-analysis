import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { AnalyzeButton } from "@/components/analysis/analyze-button"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { PageContainer } from "@/components/layout/page-container"
import { PageHeader } from "@/components/layout/page-header"

interface AnalysisPageProps {
  params: Promise<{ id: string }>
}

export default async function AnalysisPage({ params }: AnalysisPageProps) {
  const { id } = await params

  const analysis = await prisma.analysis.findUnique({
    where: { id },
    include: {
      originSubject: true,
      comparedSubject: true,
    },
  })

  if (!analysis) {
    notFound()
  }

  const existingResults = analysis.matchedZone ? {
    matchedZone: analysis.matchedZone,
    degradationScore: analysis.degradationScore,
    colorDifference: analysis.colorDifference,
    visualData: analysis.visualData as {
      originalKeypoints: string
      comparedKeypoints: string
      originalCount: number
      comparedCount: number
    } | undefined
  } : null

  return (
    <PageContainer>
      <div className="max-w-5xl mx-auto px-4">
        <PageHeader title="Analyse">
          <AnalyzeButton 
            analysisId={analysis.id}
            disabled={!analysis.originSubject.imageUrl || !analysis.comparedSubject.imageUrl}
            originImageUrl={analysis.originSubject.imageUrl}
            comparedImageUrl={analysis.comparedSubject.imageUrl}
            existingResults={existingResults}
          />
        </PageHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Première colonne : Images sources */}
          <div className="space-y-8">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">État d&apos;origine</h3>
              {analysis.originSubject.imageUrl && (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <Image
                    src={analysis.originSubject.imageUrl}
                    alt="Image d'origine"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">État comparé</h3>
              {analysis.comparedSubject.imageUrl && (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <Image
                    src={analysis.comparedSubject.imageUrl}
                    alt="Image comparée"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </Card>
          </div>

          {/* Deuxième colonne : Points détectés */}
          {analysis.visualData && (
            <div className="space-y-8">
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">Points détectés - État d&apos;origine</h3>
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <Image
                    src={analysis.visualData.originalKeypoints}
                    alt="Points détectés - État d'origine"
                    fill
                    className="object-cover"
                  />
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">Points détectés - État comparé</h3>
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <Image
                    src={analysis.visualData.comparedKeypoints}
                    alt="Points détectés - État comparé"
                    fill
                    className="object-cover"
                  />
                </div>
              </Card>
            </div>
          )}

          {/* Troisième colonne : Images recadrées (à implémenter) */}
          {analysis.matchedZone && (
            <div className="space-y-8">
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">Zone alignée - État d&apos;origine</h3>
                {/* À implémenter : image recadrée d'origine */}
              </Card>

              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">Zone alignée - État comparé</h3>
                {/* À implémenter : image recadrée comparée */}
              </Card>
            </div>
          )}
        </div>

        {/* Résultats de l'analyse en bas si nécessaire */}
        {analysis.matchedZone && (
          <Card className="mt-8 p-6">
            <h3 className="text-lg font-semibold mb-4">Résultats de l&apos;analyse</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium mb-2">Score de dégradation</h4>
                <p className="text-2xl font-bold">
                  {analysis.degradationScore?.toFixed(1)}%
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Différence de couleur</h4>
                <p className="text-2xl font-bold">
                  {analysis.colorDifference?.toFixed(1)}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Zone analysée</h4>
                <pre className="text-sm bg-muted p-2 rounded">
                  {JSON.stringify(analysis.matchedZone, null, 2)}
                </pre>
              </div>
            </div>
          </Card>
        )}
      </div>
    </PageContainer>
  )
} 