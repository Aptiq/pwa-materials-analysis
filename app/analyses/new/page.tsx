import { PageContainer } from "@/components/layout/page-container"
import { PageHeader } from "@/components/layout/page-header"
import { CreateAnalysisForm } from "@/components/analysis/create-analysis-form"
import { prisma } from "@/lib/prisma"

export default async function NewAnalysisPage() {
  // Récupérer uniquement les matières qui ont des versions
  const subjects = await prisma.subject.findMany({
    where: {
      parentSubjectId: null, // Seulement les matières d'origine
      childSubjects: {
        some: {} // Qui ont au moins une version
      }
    },
    include: {
      childSubjects: {
        orderBy: {
          createdAt: 'desc'
        }
      }
    },
    orderBy: {
      title: 'asc'
    }
  })

  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto px-4">
        <PageHeader 
          title="Nouvelle Analyse" 
          description="Comparez différents états d'une matière"
        />
        <CreateAnalysisForm subjects={subjects} />
      </div>
    </PageContainer>
  )
} 