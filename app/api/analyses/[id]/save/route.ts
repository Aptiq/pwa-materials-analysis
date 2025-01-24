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
    
    // Log détaillé des données reçues
    console.log("Données reçues pour sauvegarde:", {
      id,
      matchedZone: data.matchedZone,
      degradationScore: data.degradationScore,
      colorDifference: data.colorDifference,
      visualData: data.visualData ? Object.keys(data.visualData) : null
    })

    // Vérification plus souple des données
    if (!data) {
      throw new Error("Aucune donnée reçue")
    }

    // Préparation des données avec vérification
    const updateData = {
      matchedZone: data.matchedZone || null,
      degradationScore: data.degradationScore || null,
      colorDifference: data.colorDifference || null,
      visualData: data.visualData ? {
        image1: data.visualData.image1 || null,
        image2: data.visualData.image2 || null,
        alignedImage: data.visualData.alignedImage || null,
        keypointsOrigin: data.visualData.keypointsOrigin || null,
        keypointsCompared: data.visualData.keypointsCompared || null
      } : null,
      updatedAt: new Date()
    }

    console.log("Données préparées pour mise à jour:", updateData)

    // Tentative de mise à jour
    const analysis = await prisma.analysis.update({
      where: { id },
      data: updateData
    })

    console.log("Analyse mise à jour avec succès:", {
      id: analysis.id,
      hasMatchedZone: !!analysis.matchedZone,
      hasVisualData: !!analysis.visualData
    })

    // Revalidation des chemins
    revalidatePath(`/analyses/${id}`)
    revalidatePath('/analyses/[id]')

    return Response.json({
      success: true,
      analysis
    })

  } catch (error) {
    // Log détaillé de l'erreur
    console.error("Erreur détaillée lors de la sauvegarde:", {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })

    return Response.json(
      { 
        error: "Erreur lors de la sauvegarde des résultats",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 