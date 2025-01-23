import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { put } from '@vercel/blob'
import { revalidatePath } from 'next/cache'

// Ajout de cette ligne pour rendre la route dynamique
export const dynamic = 'force-dynamic'

// Route pour créer une matière avec ou sans image
export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string | null
    const imageFile = formData.get('image') as File | null
    const parentSubjectId = formData.get('parentSubjectId') as string | null

    if (!title) {
      return NextResponse.json(
        { error: 'Titre requis' },
        { status: 400 }
      )
    }

    // Si un parentSubjectId est fourni, vérifions qu'il existe
    if (parentSubjectId) {
      const parentExists = await prisma.subject.findUnique({
        where: { id: parentSubjectId }
      })

      if (!parentExists) {
        return NextResponse.json(
          { error: 'Matière parente non trouvée' },
          { status: 400 }
        )
      }
    }

    let imageUrl = null
    if (imageFile) {
      // Générer un nom de fichier unique
      const fileName = `${Date.now()}-${imageFile.name}`
      const blob = await put(fileName, imageFile, {
        access: 'public',
        addRandomSuffix: true
      })
      imageUrl = blob.url
    }

    const subject = await prisma.subject.create({
      data: {
        title,
        description,
        imageUrl,
        parentSubjectId,
      },
    })

    revalidatePath('/materials')
    return NextResponse.json(subject)
  } catch (error) {
    console.error('Error creating subject:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la création de la matière' },
      { status: 500 }
    )
  }
}

// Route pour récupérer les matières
export async function GET() {
  try {
    const subjects = await prisma.subject.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        parentSubject: true,
        childSubjects: true,
      },
    })
    
    return NextResponse.json(subjects)

  } catch (error) {
    console.error('Erreur récupération matières:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des matières' },
      { status: 500 }
    )
  }
} 