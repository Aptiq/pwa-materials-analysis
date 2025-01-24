import { PageContainer } from "@/components/layout/page-container"
import { PageHeader } from "@/components/layout/page-header"
import { CreateSubjectForm } from "@/components/subjects/create-subject-form"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

interface NewMaterialPageProps {
  searchParams: { parentId?: string }
}

export default async function NewMaterialPage({
  searchParams,
}: NewMaterialPageProps) {
  const params = await Promise.resolve(searchParams)
  const parentId = params.parentId
  
  let parentSubject = null
  if (parentId) {
    parentSubject = await prisma.subject.findUnique({
      where: { id: parentId }
    })
    
    if (!parentSubject) {
      notFound()
    }
  }

  const existingSubjects = await prisma.subject.findMany({
    where: {
      parentSubjectId: null // Ne récupérer que les matières d'origine
    },
    orderBy: {
      title: 'asc'
    }
  })

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto px-4">
        <PageHeader 
          title={parentSubject ? `Nouvel état de ${parentSubject.title}` : "Nouvelle Matière"}
          description={parentSubject 
            ? "Ajoutez un nouvel état pour suivre l'évolution de cette matière" 
            : "Ajoutez une nouvelle matière à analyser"
          }
        />
        <CreateSubjectForm 
          existingSubjects={existingSubjects}
          defaultParentId={parentId}
        />
      </div>
    </PageContainer>
  )
} 