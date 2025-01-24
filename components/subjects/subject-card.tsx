import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { FileQuestion } from "lucide-react"

interface SubjectCardProps {
  id: string
  title: string
  description: string | null
  imageUrl: string | null
  createdAt: Date
  childSubjects?: {
    id: string
    title: string
    imageUrl: string | null
    createdAt: Date
  }[]
}

export function SubjectCard({ 
  id, 
  title, 
  description, 
  imageUrl, 
  createdAt, 
  childSubjects = [] 
}: SubjectCardProps) {
  return (
    <Link href={`/subjects/${id}`}>
      <Card className="hover:bg-muted/50 transition-colors">
        <CardHeader className="space-y-0 pb-2">
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {imageUrl ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-muted">
              <FileQuestion className="h-10 w-10 text-muted-foreground" />
            </div>
          )}
          {description && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}
          {childSubjects.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {childSubjects.map((child) => (
                <Badge key={child.id} variant="secondary">
                  {child.title}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
} 