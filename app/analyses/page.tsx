import { prisma } from '@/lib/prisma'
import { PageHeader } from '@/components/layout/page-header'
import { AnalysisList } from '@/components/analysis/analysis-list'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'

type Analysis = {
  id: string
  originSubject: {
    id: string
    title: string
    imageUrl: string | null
  }
  comparedSubject: {
    id: string
    title: string
    imageUrl: string | null
  }
  matchedZone: any
  degradationScore: number | null
  colorDifference: number | null
  createdAt: Date
}

export default async function AnalysesPage() {
  let analyses: Analysis[] = []

  try {
    const dbAnalyses = await prisma.analysis.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        originSubject: true,
        comparedSubject: true,
      }
    })

    analyses = dbAnalyses.map(analysis => ({
      id: analysis.id,
      originSubject: {
        id: analysis.originSubject.id,
        title: analysis.originSubject.title,
        imageUrl: analysis.originSubject.imageUrl
      },
      comparedSubject: {
        id: analysis.comparedSubject.id,
        title: analysis.comparedSubject.title,
        imageUrl: analysis.comparedSubject.imageUrl
      },
      matchedZone: analysis.matchedZone,
      degradationScore: analysis.degradationScore,
      colorDifference: analysis.colorDifference,
      createdAt: analysis.createdAt
    }))
  } catch (error) {
    console.error('Error fetching analyses:', error)
  }

  return (
    <div className="container py-8">
      <PageHeader
        title="Analyses"
        description="Liste de toutes les analyses"
      >
        <Button asChild>
          <Link href="/analyses/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouvelle analyse
          </Link>
        </Button>
      </PageHeader>

      <AnalysisList analyses={analyses} />
    </div>
  )
} 