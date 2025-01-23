import { PageContainer } from "@/components/layout/page-container"
import { PageHeader } from "@/components/layout/page-header"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Image from "next/image"
import { FileQuestion } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { AnalyzeButton } from "@/components/analysis/analyze-button"
import { AnalysisResults } from "@/types/analysis"
import { MatchedZone } from '@/types/analysis'

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AnalysisPage({ params }: PageProps) {
  const resolvedParams = await params
  const { id } = resolvedParams

  const analysis = await prisma.analysis.findUnique({
    where: { id },
    include: {
      originSubject: true,
      comparedSubject: true,
    }
  })

  if (!analysis) {
    return notFound()
  }

  const results: AnalysisResults = {
    matchedZone: analysis.matchedZone as MatchedZone | null,
    degradationScore: analysis.degradationScore ?? 0,
    colorDifference: analysis.colorDifference ?? 0,
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
            results={results}
          />
        )}
      </div>
    </PageContainer>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params
  return {
    title: `Analyse ${resolvedParams.id}`,
  }
} 