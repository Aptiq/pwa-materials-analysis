import { PageContainer } from "@/components/layout/page-container"
import { PageHeader } from "@/components/layout/page-header"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Image from "next/image"
import { FileQuestion, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

export default async function SubjectPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const subject = await prisma.subject.findUnique({
    where: { id },
    include: {
      childSubjects: {
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })

  if (!subject) {
    notFound()
  }

  return (
    <PageContainer>
      <div className="max-w-5xl mx-auto px-4">
        <PageHeader 
          title={subject.title}
          description={subject.description || undefined}
        >
          <Link href={`/materials/new?parentId=${subject.id}`}>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nouvel état
            </Button>
          </Link>
        </PageHeader>

        <div className="grid gap-6">
          {/* Matière principale */}
          <Card>
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="relative aspect-square md:aspect-[4/3]">
                {subject.imageUrl ? (
                  <Image
                    src={subject.imageUrl}
                    alt={subject.title}
                    fill
                    className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-muted rounded-t-lg md:rounded-l-lg md:rounded-t-none">
                    <FileQuestion className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="p-6 md:col-span-2">
                <h2 className="text-xl font-semibold mb-2">État initial</h2>
                {subject.description && (
                  <p className="text-muted-foreground mb-4">{subject.description}</p>
                )}
                <div className="text-sm text-muted-foreground">
                  Créé le {formatDate(subject.createdAt)}
                </div>
              </div>
            </div>
          </Card>

          {/* Liste des versions */}
          {subject.childSubjects.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">États suivants</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {subject.childSubjects.map((version) => (
                  <Card key={version.id} className="overflow-hidden">
                    <div className="relative aspect-[3/2]">
                      {version.imageUrl ? (
                        <Image
                          src={version.imageUrl}
                          alt={version.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-muted">
                          <FileQuestion className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-1">{version.title}</h3>
                      {version.description && (
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {version.description}
                        </p>
                      )}
                      <div className="text-sm text-muted-foreground">
                        Créé le {formatDate(version.createdAt)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  )
} 