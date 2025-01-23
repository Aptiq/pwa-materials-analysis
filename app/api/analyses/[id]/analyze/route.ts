import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { analyzeImages } from '@/lib/image-analysis'

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const analysis = await prisma.analysis.findUnique({
      where: { id: context.params.id },
      include: {
        originSubject: true,
        comparedSubject: true,
      }
    })

    if (!analysis || !analysis.originSubject.imageUrl || !analysis.comparedSubject.imageUrl) {
      return NextResponse.json(
        { error: 'Analyse ou images introuvables' },
        { status: 404 }
      )
    }

    const results = await analyzeImages(
      analysis.originSubject.imageUrl,
      analysis.comparedSubject.imageUrl
    )

    const updatedAnalysis = await prisma.analysis.update({
      where: { id: context.params.id },
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

    return NextResponse.json(updatedAnalysis)
  } catch (error) {
    console.error('Error analyzing images:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'analyse des images' },
      { status: 500 }
    )
  }
} 