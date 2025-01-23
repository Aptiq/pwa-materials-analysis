import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { originSubjectId, comparedSubjectId } = data

    if (!originSubjectId || !comparedSubjectId) {
      return NextResponse.json(
        { error: 'Les IDs des états sont requis' },
        { status: 400 }
      )
    }

    // Vérifier que les deux états existent
    const [originState, comparedState] = await Promise.all([
      prisma.subject.findUnique({ where: { id: originSubjectId } }),
      prisma.subject.findUnique({ where: { id: comparedSubjectId } })
    ])

    if (!originState || !comparedState) {
      return NextResponse.json(
        { error: 'Un ou plusieurs états sont introuvables' },
        { status: 400 }
      )
    }

    // Créer l'analyse
    const analysis = await prisma.analysis.create({
      data: {
        originSubjectId,
        comparedSubjectId,
        matchedZone: null, // Sera mis à jour par l'algorithme d'analyse
        degradationScore: null, // Sera calculé par l'algorithme d'analyse
        colorDifference: null, // Sera calculé par l'algorithme d'analyse
      },
      include: {
        originSubject: true,
        comparedSubject: true,
      },
    })

    revalidatePath('/analyses')
    return NextResponse.json(analysis)

  } catch (error) {
    console.error('Error creating analysis:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la création de l\'analyse' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const analyses = await prisma.analysis.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        originSubject: true,
        comparedSubject: true,
      },
    })
    
    return NextResponse.json(analyses)

  } catch (error) {
    console.error('Erreur récupération analyses:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des analyses' },
      { status: 500 }
    )
  }
} 