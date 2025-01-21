import { PageContainer } from "@/components/layout/page-container"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, List } from "lucide-react"

export default function HomePage() {
  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto px-4">
        <p className="text-base md:text-lg mb-8">
          Cette application vous permet d'analyser et de gérer différents types de matériaux.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/materials">
            <Button variant="outline" size="lg">
              <List className="mr-2 h-5 w-5" />
              Voir les matières
            </Button>
          </Link>
          <Link href="/materials/new">
            <Button size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Nouvelle matière
            </Button>
          </Link>
        </div>
      </div>
    </PageContainer>
  )
}