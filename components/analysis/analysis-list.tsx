import Image from "next/image"
import Link from "next/link"
import { FileQuestion, PlusCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"

type Analysis = {
  id: string
  originSubject: {
    id: string
    title: string
    imageUrl: string | null
  }
  comparedSubject: {
    id: string
    title: string
    imageUrl: string | null
  }
  matchedZone: any
  degradationScore: number | null
  colorDifference: number | null
  createdAt: Date
}

export function AnalysisList({ analyses }: { analyses: Analysis[] }) {
  if (analyses.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <FileQuestion className="h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Aucune analyse</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            Vous n'avez pas encore créé d'analyse. Commencez par en créer une.
          </p>
          <Button asChild>
            <Link href="/analyses/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nouvelle analyse
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {analyses.map((analysis) => (
        <Link key={analysis.id} href={`/analyses/${analysis.id}`}>
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="grid grid-cols-2 gap-2">
              <div className="relative aspect-square">
                {analysis.originSubject.imageUrl ? (
                  <Image
                    src={analysis.originSubject.imageUrl}
                    alt={analysis.originSubject.title}
                    fill
                    className="object-cover rounded"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-muted rounded">
                    <FileQuestion className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="relative aspect-square">
                {analysis.comparedSubject.imageUrl ? (
                  <Image
                    src={analysis.comparedSubject.imageUrl}
                    alt={analysis.comparedSubject.title}
                    fill
                    className="object-cover rounded"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-muted rounded">
                    <FileQuestion className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <span className="font-medium">{analysis.originSubject.title}</span>
                {" vs "}
                <span className="font-medium">{analysis.comparedSubject.title}</span>
              </div>
              {analysis.degradationScore !== null && (
                <div className="mt-2 text-sm text-muted-foreground">
                  Score de dégradation : {analysis.degradationScore.toFixed(2)}
                </div>
              )}
              <div className="mt-1 text-xs text-muted-foreground">
                {formatDate(analysis.createdAt)}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
} 