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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Upload } from "lucide-react"

export function CreateSubjectForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  async function uploadImage(file: File) {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload de l\'image')
      }

      const data = await response.json()
      return data.url
    } catch (error) {
      console.error('Erreur upload:', error)
      throw new Error('Erreur lors de l\'upload de l\'image')
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

      const response = await fetch("/api/subjects", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erreur lors de la création de la matière")
      }

      toast.success("Matière créée avec succès")
      router.refresh()
      router.push("/materials")
    } catch (error) {
      console.error("Erreur:", error)
      toast.error("Erreur lors de la création de la matière")
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
            <Label htmlFor="title">Nom de la matière</Label>
            <Input
              id="title"
              name="title"
              placeholder="Ex: Acier, Aluminium, etc."
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Description de la matière..."
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <div className="flex items-center gap-4">
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                disabled={loading}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('image')?.click()}
                disabled={loading}
              >
                <Upload className="mr-2 h-4 w-4" />
                {selectedFile ? 'Changer l\'image' : 'Choisir une image'}
              </Button>
              {selectedFile && (
                <span className="text-sm text-muted-foreground">
                  {selectedFile.name}
                </span>
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