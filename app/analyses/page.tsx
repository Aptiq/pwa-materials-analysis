import { prisma } from '@/lib/prisma'
import { PageHeader } from '@/components/layout/page-header'
import { AnalysisList } from '@/components/analysis/analysis-list'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
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