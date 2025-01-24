import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { AnalyzeButton } from "@/components/analysis/analyze-button"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { PageHeader } from "@/components/layout/page-header"
import { Analysis, VisualData } from "@/types/analysis"
import React from "react"

interface AnalysisPageProps {
  params: Promise<{ id: string }>
}

export default async function AnalysisPage({ params }: AnalysisPageProps) {
  const { id } = await params

  const analysis = await prisma.analysis.findUnique({
    where: { id },
    include: {
      originSubject: true,
      comparedSubject: true,
    },
  })

  if (!analysis) {
    notFound()
  }

  const visualData = analysis.visualData as VisualData | null

  const existingResults = analysis.visualData ? {
    matchedZone: analysis.matchedZone || {},
    degradationScore: analysis.degradationScore,
    colorDifference: analysis.colorDifference,
    visualData: visualData
  } : null

  return React.createElement(
    "div",
    { className: "py-8 px-4 md:py-16 md:px-0 space-y-6 md:space-y-8" },
    React.createElement(
      "div",
      { className: "max-w-5xl mx-auto px-4" },
      React.createElement(
        PageHeader,
        { title: "Analyse" },
        React.createElement(AnalyzeButton, {
          analysisId: analysis.id,
          disabled: !analysis.originSubject.imageUrl || !analysis.comparedSubject.imageUrl,
          originImageUrl: analysis.originSubject.imageUrl,
          comparedImageUrl: analysis.comparedSubject.imageUrl,
          existingResults: existingResults,
        })
      ),
      React.createElement(
        "div",
        { className: "grid grid-cols-1 md:grid-cols-3 gap-8" },
        React.createElement(
          "div",
          { className: "space-y-8" },
          React.createElement(
            Card,
            { className: "p-4" },
            React.createElement(
              "h3",
              { className: "text-lg font-semibold mb-4" },
              "État d&apos;origine"
            ),
            analysis.originSubject.imageUrl && React.createElement(
              "div",
              { className: "relative aspect-video w-full overflow-hidden rounded-lg" },
              React.createElement(
                Image,
                {
                  src: analysis.originSubject.imageUrl,
                  alt: "Image d'origine",
                  fill: true,
                  className: "object-cover"
                }
              )
            )
          ),
          React.createElement(
            Card,
            { className: "p-4" },
            React.createElement(
              "h3",
              { className: "text-lg font-semibold mb-4" },
              "État comparé"
            ),
            analysis.comparedSubject.imageUrl && React.createElement(
              "div",
              { className: "relative aspect-video w-full overflow-hidden rounded-lg" },
              React.createElement(
                Image,
                {
                  src: analysis.comparedSubject.imageUrl,
                  alt: "Image comparée",
                  fill: true,
                  className: "object-cover"
                }
              )
            )
          )
        ),
        analysis.matchedZone && visualData ? React.createElement(
          "div",
          { className: "md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8" },
          React.createElement(
            "div",
            { className: "space-y-4" },
            React.createElement(
              Card,
              null,
              React.createElement(
                "h3",
                { className: "text-lg font-semibold p-4 pb-0" },
                "Points détectés - État d&apos;origine"
              ),
              React.createElement(
                "div",
                { className: "relative aspect-video w-full overflow-hidden p-4" },
                React.createElement(
                  Image,
                  {
                    src: visualData.originalKeypoints || visualData.image1,
                    alt: "Points détectés - État d'origine",
                    fill: true,
                    className: "object-cover"
                  }
                )
              )
            ),
            React.createElement(
              Card,
              null,
              React.createElement(
                "h3",
                { className: "text-lg font-semibold p-4 pb-0" },
                "Points détectés - État comparé"
              ),
              React.createElement(
                "div",
                { className: "relative aspect-video w-full overflow-hidden p-4" },
                React.createElement(
                  Image,
                  {
                    src: visualData.comparedKeypoints || visualData.image2,
                    alt: "Points détectés - État comparé",
                    fill: true,
                    className: "object-cover"
                  }
                )
              )
            )
          ),
          React.createElement(
            "div",
            { className: "space-y-8" },
            React.createElement(
              Card,
              { className: "p-4" },
              React.createElement(
                "h3",
                { className: "text-lg font-semibold mb-4" },
                "Zone alignée - État d&apos;origine"
              ),
              visualData.alignedOrigin || visualData.alignedImage && React.createElement(
                "div",
                { className: "relative aspect-video w-full overflow-hidden rounded-lg" },
                React.createElement(
                  Image,
                  {
                    src: visualData.alignedOrigin || visualData.alignedImage,
                    alt: "Zone alignée - État d'origine",
                    fill: true,
                    className: "object-cover"
                  }
                )
              )
            ),
            React.createElement(
              Card,
              { className: "p-4" },
              React.createElement(
                "h3",
                { className: "text-lg font-semibold mb-4" },
                "Zone alignée - État comparé"
              ),
              visualData.alignedCompared || visualData.alignedImage && React.createElement(
                "div",
                { className: "relative aspect-video w-full overflow-hidden rounded-lg" },
                React.createElement(
                  Image,
                  {
                    src: visualData.alignedCompared || visualData.alignedImage,
                    alt: "Zone alignée - État comparé",
                    fill: true,
                    className: "object-cover"
                  }
                )
              )
            )
          )
        ) : React.createElement(
          "div",
          { className: "md:col-span-2" },
          React.createElement(
            Card,
            { className: "p-6" },
            React.createElement(
              "div",
              { className: "flex flex-col items-center justify-center h-full min-h-[200px] text-center" },
              React.createElement(
                "p",
                { className: "text-lg text-muted-foreground mb-2" },
                "Lancez l&apos;analyse pour voir les résultats détaillés"
              ),
              React.createElement(
                "p",
                { className: "text-sm text-muted-foreground" },
                "Les points détectés et les zones alignées s&apos;afficheront ici"
              )
            )
          )
        )
      ),
      analysis.matchedZone && React.createElement(
        Card,
        { className: "mt-8 p-6" },
        React.createElement(
          "h3",
          { className: "text-lg font-semibold mb-4" },
          "Résultats de l&apos;analyse"
        ),
        React.createElement(
          "div",
          { className: "grid grid-cols-3 gap-4" },
          React.createElement(
            "div",
            null,
            React.createElement(
              "h4",
              { className: "font-medium mb-2" },
              "Score de dégradation"
            ),
            React.createElement(
              "p",
              { className: "text-2xl font-bold" },
              analysis.degradationScore?.toFixed(1)
            )
          ),
          React.createElement(
            "div",
            null,
            React.createElement(
              "h4",
              { className: "font-medium mb-2" },
              "Différence de couleur"
            ),
            React.createElement(
              "p",
              { className: "text-2xl font-bold" },
              analysis.colorDifference?.toFixed(1)
            )
          ),
          React.createElement(
            "div",
            null,
            React.createElement(
              "h4",
              { className: "font-medium mb-2" },
              "Zone analysée"
            ),
            React.createElement(
              "pre",
              { className: "text-sm bg-muted p-2 rounded" },
              JSON.stringify(analysis.matchedZone, null, 2)
            )
          )
        )
      )
    )
  )
} 