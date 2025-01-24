import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const data = await request.json()

    // Vérifier que l'analyse existe
    const existingAnalysis = await prisma.analysis.findUnique({
      where: { id },
    })

    if (!existingAnalysis) {
      return NextResponse.json(
        { error: "Analyse non trouvée" },
        { status: 404 }
      )
    }

    // Préparer les données pour la mise à jour
    const updateData: Prisma.AnalysisUpdateInput = {
      matchedZone: data.matchedZone,
      degradationScore: data.degradationScore,
      colorDifference: data.colorDifference,
      visualData: data.visualData ? {
        image1: data.visualData.image1,
        image2: data.visualData.image2,
        alignedImage: data.visualData.alignedImage,
        keypointsOrigin: data.visualData.keypointsOrigin,
        keypointsCompared: data.visualData.keypointsCompared,
      } : Prisma.JsonNull,
      updatedAt: new Date(),
    }

    const analysis = await prisma.analysis.update({
      where: { id },
      data: updateData
    })

    console.log("Analyse mise à jour avec succès:", {
      id: analysis.id,
      matchedZone: analysis.matchedZone,
      degradationScore: analysis.degradationScore,
      colorDifference: analysis.colorDifference,
    })

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'analyse:", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'analyse" },
      { status: 500 }
    )
  }
} 