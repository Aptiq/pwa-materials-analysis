import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Subject = {
  id: string
  title: string
  description: string | null
  imageUrl: string | null
  createdAt: Date
}

interface SubjectListProps {
  subjects: Subject[]
}

export function SubjectList({ subjects }: SubjectListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {subjects.map((subject) => (
        <Card key={subject.id}>
          {subject.imageUrl && (
            <div className="relative w-full h-48">
              <Image
                src={subject.imageUrl}
                alt={subject.title}
                fill
                className="object-cover rounded-t-lg"
              />
            </div>
          )}
          <CardHeader>
            <CardTitle>{subject.title}</CardTitle>
          </CardHeader>
          {subject.description && (
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {subject.description}
              </p>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
} 