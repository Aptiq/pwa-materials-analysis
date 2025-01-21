import { PageContainer } from "@/components/layout/page-container"
import { PageHeader } from "@/components/layout/page-header"
import { prisma } from "@/lib/prisma"
import { SubjectList } from "@/components/subjects/subject-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

// Définir le type Subject
type Subject = {
  id: string
  title: string
  description: string | null
  imageUrl: string | null
  createdAt: Date
}

export default async function MaterialsPage() {
  let subjects: Subject[] = []

  try {
    subjects = await prisma.subject.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des matières:", error)
  }

  return (
    <PageContainer>
      <div className="max-w-5xl mx-auto px-4">
        <PageHeader title="Matières">
          <Link href="/materials/new">
            <Button size="icon" variant="ghost">
              <Plus className="h-4 w-4" />
              <span className="sr-only">Ajouter une matière</span>
            </Button>
          </Link>
        </PageHeader>

        {subjects.length === 0 ? (
          <div className="text-center py-12 bg-muted/50 rounded-lg">
            <p className="text-muted-foreground mb-4">
              Aucune matière n&apos;a été créée pour le moment.
            </p>
            <Link href="/materials/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Créer une matière
              </Button>
            </Link>
          </div>
        ) : (
          <SubjectList subjects={subjects} />
        )}
      </div>
    </PageContainer>
  )
}