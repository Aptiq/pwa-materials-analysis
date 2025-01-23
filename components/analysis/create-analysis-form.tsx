"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { toast } from "sonner"
import { Upload, Loader2 } from "lucide-react"

type Subject = {
  id: string
  title: string
  imageUrl: string | null
  childSubjects: {
    id: string
    title: string
    imageUrl: string | null
  }[]
}

export function CreateAnalysisForm({ subjects }: { subjects: Subject[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [originStateId, setOriginStateId] = useState<string>("")
  const [comparedStateId, setComparedStateId] = useState<string>("")

  const selectedSubjectData = subjects.find(s => s.id === selectedSubject)
  const allStates = selectedSubjectData 
    ? [selectedSubjectData, ...selectedSubjectData.childSubjects]
    : []

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/analyses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originSubjectId: originStateId,
          comparedSubjectId: comparedStateId,
        }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la création de l'analyse")
      }

      toast.success("Analyse créée avec succès")
      router.refresh()
      router.push("/analyses")
    } catch (error) {
      console.error("Erreur:", error)
      toast.error("Erreur lors de la création de l'analyse")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nouvelle Analyse</CardTitle>
        <CardDescription>
          Comparez différents états d'une même matière
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Sélectionner une matière</Label>
              <Select
                value={selectedSubject}
                onValueChange={(value) => {
                  setSelectedSubject(value)
                  setOriginStateId("")
                  setComparedStateId("")
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une matière" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.title} ({subject.childSubjects.length} états)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedSubject && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>État initial</Label>
                  <Select
                    value={originStateId}
                    onValueChange={setOriginStateId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir l'état initial" />
                    </SelectTrigger>
                    <SelectContent>
                      {allStates.map((state) => (
                        <SelectItem 
                          key={state.id} 
                          value={state.id}
                          disabled={state.id === comparedStateId}
                        >
                          {state.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>État à comparer</Label>
                  <Select
                    value={comparedStateId}
                    onValueChange={setComparedStateId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir l'état à comparer" />
                    </SelectTrigger>
                    <SelectContent>
                      {allStates.map((state) => (
                        <SelectItem 
                          key={state.id} 
                          value={state.id}
                          disabled={state.id === originStateId}
                        >
                          {state.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || !originStateId || !comparedStateId}
          >
            {loading ? "Création en cours..." : "Créer l'analyse"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 