import { PageContainer } from "@/components/layout/page-container"
import { PageHeader } from "@/components/layout/page-header"
import { prisma } from "@/lib/prisma"
import { AnalysisList } from "@/components/analysis/analysis-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function AnalysesPage() {
  let analyses = []

  try {
    analyses = await prisma.analysis.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        originSubject: true,
        comparedSubject: true
      }
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des analyses:", error)
  }

  return (
    <PageContainer>
      <div className="max-w-5xl mx-auto px-4">
        <PageHeader title="Analyses">
          <Link href="/analyses/new">
            <Button size="icon" variant="ghost">
              <Plus className="h-4 w-4" />
              <span className="sr-only">Ajouter une analyse</span>
            </Button>
          </Link>
        </PageHeader>

        {analyses.length === 0 ? (
          <div className="text-center py-12 bg-muted/50 rounded-lg">
            <p className="text-muted-foreground mb-4">
              Aucune analyse n&apos;a été créée pour le moment.
            </p>
            <Link href="/analyses/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Créer une analyse
              </Button>
            </Link>
          </div>
        ) : (
          <AnalysisList analyses={analyses} />
        )}
      </div>
    </PageContainer>
  )
} 