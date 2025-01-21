import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Ajout de cette ligne pour rendre la route dynamique
export const dynamic = 'force-dynamic'

// Route pour créer une matière avec ou sans image
export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const file = formData.get('image') as File | null
    
    if (!title) {
      return NextResponse.json(
        { error: 'Titre requis' },
        { status: 400 }
      )
    }

    let imageUrl = null
    if (file) {
      try {
        const blob = await put(file.name, file, {
          access: 'public',
        })
        imageUrl = blob.url
      } catch (error) {
        console.error('Erreur upload image:', error)
      }
    }

    const subject = await prisma.subject.create({
      data: {
        title,
        description: description || null,
        imageUrl: imageUrl,
      },
    })

    return NextResponse.json(subject)

  } catch (error) {
    console.error('Erreur création matière:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la matière' },
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