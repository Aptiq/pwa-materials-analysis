import Image from "next/image"
import Link from "next/link"
import { FileQuestion } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Subject = {
  id: string
  title: string
  description: string | null
  imageUrl: string | null
  createdAt: Date
  childSubjects: {
    id: string
    title: string
    imageUrl: string | null
    createdAt: Date
  }[]
}

export function SubjectList({ subjects }: { subjects: Subject[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {subjects.map((subject) => (
        <Link key={subject.id} href={`/materials/${subject.id}`}>
          <Card className="overflow-hidden hover:bg-muted/50 transition-colors h-[280px]">
            <div className="relative aspect-[16/9] w-full">
              <div className="h-full p-2">
                <div className="relative h-full w-full overflow-hidden rounded">
                  {subject.imageUrl ? (
                    <Image
                      src={subject.imageUrl}
                      alt={subject.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-muted">
                      <FileQuestion className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <CardTitle className="line-clamp-1 text-base">
                  {subject.title}
                </CardTitle>
                {subject.childSubjects.length > 0 && (
                  <Badge variant="secondary">
                    {subject.childSubjects.length} version{subject.childSubjects.length > 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
              {subject.description && (
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {subject.description}
                </p>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

// Ajouter un gestionnaire d'erreur et des logs
const loadOpenCv = async () => {
  try {
    if (typeof window === 'undefined') return
    
    console.log("Début du chargement d'OpenCV...")
    await loadOpenCvScript()
    console.log("OpenCV chargé avec succès")
    
    // Vérifier si cv est bien disponible
    if (window.cv) {
      console.log("OpenCV est prêt à être utilisé")
    } else {
      console.error("OpenCV n'est pas disponible après le chargement")
    }
  } catch (error) {
    console.error("Erreur lors du chargement d'OpenCV:", error)
  }
}

const loadOpenCvWithTimeout = async () => {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Timeout lors du chargement d'OpenCV")), 10000)
  })
  
  try {
    await Promise.race([loadOpenCv(), timeout])
  } catch (error) {
    console.error(error)
    // Gérer l'erreur (afficher un message à l'utilisateur, etc.)
  }
} 