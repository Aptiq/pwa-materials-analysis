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
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="relative aspect-video w-full overflow-hidden">
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
                  <FileQuestion className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <CardTitle className="line-clamp-1">{subject.title}</CardTitle>
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