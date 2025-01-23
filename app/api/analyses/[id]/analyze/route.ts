import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { analyzeImages } from '@/lib/image-analysis'

interface RequestContext {
  params: {
    id: string;
  };
}

export async function POST(
  request: Request | NextRequest,
  { params }: RequestContext
): Promise<Response> {
  try {
    const analysis = await prisma.analysis.findUnique({
      where: { id: params.id },
      include: {
        originSubject: true,
        comparedSubject: true,
      }
    })

    if (!analysis || !analysis.originSubject.imageUrl || !analysis.comparedSubject.imageUrl) {
      return new Response(
        JSON.stringify({ error: 'Analyse ou images introuvables' }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
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

    return new Response(
      JSON.stringify(updatedAnalysis),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error analyzing images:', error)
    return new Response(
      JSON.stringify({ error: 'Erreur lors de l\'analyse des images' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
} 