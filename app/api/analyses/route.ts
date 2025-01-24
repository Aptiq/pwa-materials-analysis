import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  console.log("API: Début de la requête") // Log A
  
  try {
    const body = await request.json()
    console.log("API: Corps de la requête:", body) // Log B

    if (!body.originSubjectId || !body.comparedSubjectId) {
      console.log("API: IDs manquants") // Log C
      return Response.json(
        { error: "Les IDs des sujets sont requis" },
        { status: 400 }
      )
    }

    console.log("API: Création de l'analyse...") // Log D
    const analysis = await prisma.analysis.create({
      data: {
        originSubjectId: body.originSubjectId,
        comparedSubjectId: body.comparedSubjectId,
        matchedZone: null,
        degradationScore: null,
        colorDifference: null,
        visualData: null,
      },
      include: {
        originSubject: true,
        comparedSubject: true,
      }
    })

    console.log("API: Analyse créée avec succès:", analysis) // Log E
    revalidatePath('/analyses')

    return Response.json(analysis)
  } catch (error) {
    console.log("API: Erreur lors de la création:", error) // Log F
    return Response.json(
      { error: "Erreur lors de la création de l'analyse" },
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