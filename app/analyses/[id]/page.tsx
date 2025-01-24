import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { AnalyzeButton } from "@/components/analysis/analyze-button"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { PageContainer } from "@/components/layout/page-container"
import { PageHeader } from "@/components/layout/page-header"
import { Analysis, VisualData } from "@/types/analysis"

interface AnalysisPageProps {
  params: Promise<{ id: string }>
}

export default async function AnalysisPage({ params }: AnalysisPageProps) {
  const { id } = await params

  // Récupérer l'analyse avec toutes les données nécessaires
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

  // Cast visualData to our type
  const visualData = analysis.visualData as VisualData | null

  // Modifier la condition pour créer existingResults
  const existingResults = analysis.visualData ? {
    matchedZone: analysis.matchedZone || {},  // Fournir un objet vide si null
    degradationScore: analysis.degradationScore,
    colorDifference: analysis.colorDifference,
    visualData: visualData
  } : null

  // Pour déboguer
  console.log('Analysis Data on Page Load:', {
    id: analysis.id,
    hasMatchedZone: !!analysis.matchedZone,
    hasVisualData: !!visualData,
    existingResults: !!existingResults,
    visualDataKeys: visualData ? Object.keys(visualData) : null
  })

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
          {/* Première colonne : Images sources - toujours affichée */}
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

          {/* Colonnes d'analyse - affichées uniquement si l'analyse a été effectuée */}
          {analysis.matchedZone && visualData ? (
            <>
              {/* Deuxième colonne : Points détectés */}
              <div className="space-y-4">
                <Card>
                  <h3 className="text-lg font-semibold p-4 pb-0">Points détectés - État d&apos;origine</h3>
                  <div className="relative aspect-video w-full overflow-hidden p-4">
                    <Image
                      src={visualData.originalKeypoints || visualData.image1}
                      alt="Points détectés - État d'origine"
                      fill
                      className="object-cover"
                    />
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold p-4 pb-0">Points détectés - État comparé</h3>
                  <div className="relative aspect-video w-full overflow-hidden p-4">
                    <Image
                      src={visualData.comparedKeypoints || visualData.image2}
                      alt="Points détectés - État comparé"
                      fill
                      className="object-cover"
                    />
                  </div>
                </Card>
              </div>

              {/* Troisième colonne : Images recadrées */}
              <div className="space-y-8">
                <Card className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Zone alignée - État d&apos;origine</h3>
                  {visualData.alignedOrigin && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                      <Image
                        src={visualData.alignedOrigin}
                        alt="Zone alignée - État d'origine"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </Card>

                <Card className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Zone alignée - État comparé</h3>
                  {visualData.alignedCompared && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                      <Image
                        src={visualData.alignedCompared}
                        alt="Zone alignée - État comparé"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </Card>
              </div>
            </>
          ) : (
            <div className="md:col-span-2">
              <Card className="p-6">
                <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
                  <p className="text-lg text-muted-foreground mb-2">
                    Lancez l&apos;analyse pour voir les résultats détaillés
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Les points détectés et les zones alignées s&apos;afficheront ici
                  </p>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Résultats de l'analyse - affichés uniquement si l'analyse a été effectuée */}
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