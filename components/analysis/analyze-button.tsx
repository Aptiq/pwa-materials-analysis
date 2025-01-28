"use client"

import { useState, useCallback, useMemo } from "react"
import { Button, ButtonProps } from "@/components/ui/button"
import { Loader2, Search } from "lucide-react"
import { useCv } from "@/components/cv-provider"
import { detectKeypoints, matToBase64, analyzeImages, AnalysisResult } from "@/lib/image-analysis"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { VisualData } from "@/types/analysis"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import Image from "next/image"

type OpenCVMat = {
  delete(): void
  rows: number
  cols: number
  clone(): OpenCVMat
  data: Uint8Array
  data32F: Float32Array
  step: number
  elemSize(): number
}

type OpenCVPoint2 = {
  x: number
  y: number
}

type OpenCVKeyPoint = {
  pt: OpenCVPoint2
  size: number
  angle: number
  response: number
  octave: number
  class_id: number
}

type OpenCVKeyPointVector = {
  size(): number
  get(index: number): OpenCVKeyPoint
  delete(): void
}

type OpenCVDMatchVector = {
  size(): number
  get(index: number): any
  delete(): void
}

type OpenCVDMatchVectorVector = {
  size(): number
  get(index: number): OpenCVDMatchVector
  delete(): void
}

type OpenCVSize = {
  width: number
  height: number
}

interface OpenCV {
  imread(img: HTMLImageElement): OpenCVMat
  imshow(canvas: HTMLCanvasElement, mat: OpenCVMat): void
  Mat: {
    new (): OpenCVMat
    new (rows: number, cols: number, type: number): OpenCVMat
  }
  Size: new (width: number, height: number) => OpenCVSize
  KeyPointVector: new () => OpenCVKeyPointVector
  DMatchVector: new () => OpenCVDMatchVector
  DMatchVectorVector: new () => OpenCVDMatchVectorVector
  cvtColor(src: OpenCVMat, dst: OpenCVMat, code: number): void
  AKAZE: new () => any
  BFMatcher: new (normType: number, crossCheck: boolean) => any
  findHomography(srcPoints: OpenCVMat, dstPoints: OpenCVMat, method: number, ransacReprojThreshold: number): OpenCVMat
  perspectiveTransform(src: OpenCVMat, dst: OpenCVMat, m: OpenCVMat): void
  warpPerspective(src: OpenCVMat, dst: OpenCVMat, m: OpenCVMat, dsize: OpenCVSize): void
  NORM_HAMMING: number
  COLOR_RGBA2GRAY: number
  RANSAC: number
  CV_32FC2: number
}

interface DetectionResult {
  keypoints: OpenCVKeyPointVector
  descriptors: OpenCVMat
  visualResult: OpenCVMat
}

interface AnalyzeButtonProps {
  analysisId: string
  disabled?: boolean
  originImageUrl: string | null
  comparedImageUrl: string | null
  existingResults?: {
    matchedZone: any
    degradationScore: number | null
    colorDifference: number | null
    visualData: VisualData | null
  } | null
}

type DialogImages = {
  original1: string;
  original2: string;
  aligned: string;
}

function AnalysisDialog({
  images,
  onClose
}: {
  images: DialogImages | null;
  onClose: () => void;
}) {
  if (!images) return null;

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="aspect-square relative">
            <Image
              src={images.original1}
              alt="Image originale 1"
              fill
              className="object-cover"
            />
          </div>
          <div className="aspect-square relative">
            <Image
              src={images.original2}
              alt="Image originale 2"
              fill
              className="object-cover"
            />
          </div>
          <div className="aspect-square relative md:col-span-2">
            <Image
              src={images.aligned}
              alt="Image alignée"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function AnalyzeButton({ 
  existingResults,
  ...props 
}: {
  existingResults?: AnalysisResult
} & ButtonProps) {
  const [showDialog, setShowDialog] = useState(false)
  
  const dialogImages = useMemo(() => {
    if (!existingResults?.visualData) return null;
    
    const { image1, image2, alignedImage } = existingResults.visualData;
    
    // Vérification stricte des valeurs null
    if (!image1 || !image2 || !alignedImage) return null;
    
    // Construction d'un objet avec des chaînes garanties
    return {
      original1: image1,
      original2: image2,
      aligned: alignedImage
    } as const;
  }, [existingResults?.visualData])

  return (
    <>
      <Button
        variant="default"
        onClick={() => setShowDialog(true)}
        {...props}
      >
        Analyser
      </Button>

      {showDialog && (
        <AnalysisDialog
          images={dialogImages}
          onClose={() => setShowDialog(false)}
        />
      )}
    </>
  )
}

// Fonction utilitaire pour charger une image
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}