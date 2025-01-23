import { PageContainer } from "@/components/layout/page-container"
import { PageHeader } from "@/components/layout/page-header"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Image from "next/image"
import { FileQuestion } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { AnalyzeButton } from "@/components/analysis/analyze-button"
import { AnalysisResults } from "@/components/analysis/analysis-results"

interface PageProps {
  params: {
    id: string
  }
  searchParams?: { [key: string]: string | string[] | undefined }
}

export default async function AnalysisPage({ 
  params,
  searchParams 
}: PageProps) {
  const analysis = await prisma.analysis.findUnique({
    where: { 
      id: params.id 
    },
    include: {
      originSubject: true,
      comparedSubject: true,
    }
  })

  if (!analysis) {
    return notFound()
  }

  return (
    <PageContainer>
      <div className="max-w-5xl mx-auto px-4">
        <PageHeader 
          title="Résultats de l'analyse"
          description={`Comparaison entre ${analysis.originSubject.title} et ${analysis.comparedSubject.title}`}
        >
          <AnalyzeButton 
            analysisId={analysis.id}
            disabled={!analysis.originSubject.imageUrl || !analysis.comparedSubject.imageUrl}
          />
        </PageHeader>

        {analysis.originSubject.imageUrl && analysis.comparedSubject.imageUrl && (
          <AnalysisResults
            originImage={analysis.originSubject.imageUrl}
            comparedImage={analysis.comparedSubject.imageUrl}
            results={{
              matchedZone: analysis.matchedZone,
              degradationScore: analysis.degradationScore,
              colorDifference: analysis.colorDifference,
            }}
          />
        )}
      </div>
    </PageContainer>
  )
}

// Ajout de generateMetadata pour gérer les métadonnées de manière asynchrone
export async function generateMetadata({ params }: PageProps) {
  return {
    title: `Analyse ${params.id}`,
  }
} 