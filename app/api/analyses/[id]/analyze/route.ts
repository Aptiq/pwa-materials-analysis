import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { analyzeImages } from '@/lib/image-analysis'

export async function POST(
  request: NextRequest,
  { params }: { params: { [key: string]: string | undefined } }
): Promise<Response> {
  try {
    if (!params.id) {
      return Response.json(
        { error: 'ID manquant' },
        { status: 400 }
      )
    }

    const analysis = await prisma.analysis.findUnique({
      where: { id: params.id },
      include: {
        originSubject: true,
        comparedSubject: true,
      }
    })

    if (!analysis || !analysis.originSubject.imageUrl || !analysis.comparedSubject.imageUrl) {
      return Response.json(
        { error: 'Analyse ou images introuvables' },
        { status: 404 }
      )
    }

    const results = await analyzeImages(
      analysis.originSubject.imageUrl,
      analysis.comparedSubject.imageUrl
    )

    const updatedAnalysis = await prisma.analysis.update({
      where: { id: params.id },
      data: {
        matchedZone: results.matchedZone,
        degradationScore: results.degradationScore,
        colorDifference: results.colorDifference,
      },
      include: {
        originSubject: true,
        comparedSubject: true,
      }
    })

    return Response.json(updatedAnalysis)
  } catch (error) {
    console.error('Error analyzing images:', error)
    return Response.json(
      { error: 'Erreur lors de l\'analyse des images' },
      { status: 500 }
    )
  }
} 