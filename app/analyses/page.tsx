import { prisma } from '@/lib/prisma'
import { PageHeader } from '@/components/layout/page-header'
import { AnalysesList } from '@/components/analyses-list'
import { CreateAnalysisButton } from '@/components/create-analysis-button'
import type { Analysis } from '@prisma/client'

export default async function AnalysesPage() {
  let analyses: Analysis[] = []

  try {
    analyses = await prisma.analysis.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        originSubject: true,
        comparedSubject: true,
      }
    })
  } catch (error) {
    console.error('Error fetching analyses:', error)
  }

  return (
    <div className="container py-8">
      <PageHeader
        title="Analyses"
        description="Liste de toutes les analyses"
      >
        <CreateAnalysisButton />
      </PageHeader>

      <AnalysesList analyses={analyses} />
    </div>
  )
} 