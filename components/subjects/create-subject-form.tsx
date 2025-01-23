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
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { Upload } from "lucide-react"

type Subject = {
  id: string
  title: string
  description?: string | null
  imageUrl?: string | null
}

interface CreateSubjectFormProps {
  existingSubjects: Subject[]
  defaultParentId?: string
}

export function CreateSubjectForm({ 
  existingSubjects, 
  defaultParentId 
}: CreateSubjectFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isNewVersion, setIsNewVersion] = useState(!!defaultParentId)
  const [parentSubjectId, setParentSubjectId] = useState<string>(defaultParentId || "")

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(event.currentTarget)
      
      if (selectedFile) {
        formData.append('image', selectedFile)
      }
      
      if (isNewVersion && parentSubjectId) {
        formData.append('parentSubjectId', parentSubjectId)
      }

      const response = await fetch("/api/subjects", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = "Erreur lors de la création de la matière"
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.error || errorMessage
        } catch {
          // Si le parsing JSON échoue, on utilise le message par défaut
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      toast.success("Matière créée avec succès")
      router.refresh()
      router.push("/materials")
    } catch (error) {
      console.error("Erreur:", error)
      toast.error(error instanceof Error ? error.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nouvelle Matière</CardTitle>
        <CardDescription>
          Ajoutez une nouvelle matière à analyser
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isNewVersion"
                checked={isNewVersion}
                onCheckedChange={(checked) => {
                  setIsNewVersion(checked as boolean)
                  if (!checked) setParentSubjectId("")
                }}
                disabled={!!defaultParentId}
              />
              <Label htmlFor="isNewVersion">
                Nouvelle version d'une matière existante
              </Label>
            </div>
          </div>

          {isNewVersion && (
            <div className="space-y-2">
              <Label htmlFor="parentSubject">Matière d'origine</Label>
              <Select
                value={parentSubjectId}
                onValueChange={setParentSubjectId}
                disabled={!!defaultParentId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner la matière d'origine" />
                </SelectTrigger>
                <SelectContent>
                  {existingSubjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input id="title" name="title" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" />
          </div>

          <div className="space-y-2">
            <Label>Image</Label>
            <div className="flex items-center gap-4">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('image')?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                {selectedFile ? 'Changer l\'image' : 'Ajouter une image'}
              </Button>
              {preview && (
                <div className="relative w-20 h-20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Création en cours..." : "Créer la matière"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 