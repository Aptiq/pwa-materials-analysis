import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params
    const data = await request.json()
    console.log("Sauvegarde de l'analyse:", id, data)

    const analysis = await prisma.analysis.update({
      where: { id },
      data: {
        matchedZone: data.matchedZone,
        degradationScore: data.degradationScore,
        colorDifference: data.colorDifference,
        visualData: data.visualData,
      },
    })

    console.log("Analyse mise à jour:", analysis)
    revalidatePath(`/analyses/${id}`)

    return Response.json(analysis)
  } catch (error) {
    console.error("Erreur lors de la sauvegarde:", error)
    return Response.json(
      { error: "Erreur lors de la sauvegarde des résultats" },
      { status: 500 }
    )
  }
} 