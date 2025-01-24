'use client'

import type { Mat, Point2 } from "@techstark/opencv-js"
import { VisualData } from "@/types/analysis"

interface AlignmentResult {
  homography: Mat
  matchedKeypoints: {
    origin: Point2[]
    compared: Point2[]
  }
}

export interface AnalysisResult {
  matchedZone: {
    x: number
    y: number
    width: number
    height: number
  }
  degradationScore: number
  colorDifference: number
  visualData: VisualData
  error?: string
}

async function alignImages(source: cv.Mat, target: cv.Mat): Promise<AlignmentResult> {
  let sourceGray = new cv.Mat()
  let targetGray = new cv.Mat()
  let sourceKeypoints = new cv.KeyPointVector()
  let targetKeypoints = new cv.KeyPointVector()
  let sourceDescriptors = new cv.Mat()
  let targetDescriptors = new cv.Mat()
  let matches = new cv.DMatchVectorVector()
  let srcPoints: cv.Mat | null = null
  let dstPoints: cv.Mat | null = null
  
  try {
    // 1. Détecter les points clés dans les deux images
    cv.cvtColor(source, sourceGray, cv.COLOR_RGBA2GRAY)
    cv.cvtColor(target, targetGray, cv.COLOR_RGBA2GRAY)
    
    // Utiliser AKAZE qui est disponible dans OpenCV.js
    const akaze = new cv.AKAZE()
    
    // Détecter les points clés
    akaze.detect(sourceGray, sourceKeypoints)
    akaze.detect(targetGray, targetKeypoints)
    
    // Calculer les descripteurs
    akaze.compute(sourceGray, sourceKeypoints, sourceDescriptors)
    akaze.compute(targetGray, targetKeypoints, targetDescriptors)
    
    // 2. Trouver les meilleures correspondances
    const matcher = new cv.BFMatcher()
    matcher.knnMatch(sourceDescriptors, targetDescriptors, matches, 2)
    
    // 3. Filtrer les bonnes correspondances (ratio test de Lowe)
    const goodMatches = []
    for (let i = 0; i < matches.size(); i++) {
      const match = matches.get(i)
      if (match.get(0).distance < 0.7 * match.get(1).distance) {
        goodMatches.push(match.get(0))
      }
    }
    
    // 4. Calculer l'homographie si on a assez de bonnes correspondances
    if (goodMatches.length < 4) {
      return { homography: source.clone(), matchedKeypoints: { origin: [], compared: [] }, success: false }
    }
    
    // Créer les matrices pour les points
    srcPoints = new cv.Mat(goodMatches.length, 1, cv.CV_32FC2)
    dstPoints = new cv.Mat(goodMatches.length, 1, cv.CV_32FC2)
    
    // Extraire les points correspondants
    for (let i = 0; i < goodMatches.length; i++) {
      const srcPt = sourceKeypoints.get(goodMatches[i].queryIdx).pt
      const dstPt = targetKeypoints.get(goodMatches[i].trainIdx).pt
      srcPoints.data32F[i * 2] = srcPt.x
      srcPoints.data32F[i * 2 + 1] = srcPt.y
      dstPoints.data32F[i * 2] = dstPt.x
      dstPoints.data32F[i * 2 + 1] = dstPt.y
    }
    
    // Calculer l'homographie
    const homography = cv.findHomography(srcPoints, dstPoints, cv.RANSAC)
    
    // 5. Appliquer la transformation
    const alignedImage = new cv.Mat()
    cv.warpPerspective(
      source,
      alignedImage,
      homography,
      new cv.Size(target.cols, target.rows)
    )
    
    return {
      homography,
      matchedKeypoints: {
        origin: Array.from(goodMatches.map(m => m.queryIdx).map(i => sourceKeypoints.get(i).pt)),
        compared: Array.from(goodMatches.map(m => m.trainIdx).map(i => targetKeypoints.get(i).pt))
      },
      success: true
    }
    
  } catch (error) {
    console.error("Erreur lors de l'alignement des images:", error)
    return { homography: source.clone(), matchedKeypoints: { origin: [], compared: [] }, success: false }
  } finally {
    // Nettoyer les ressources
    sourceGray.delete()
    targetGray.delete()
    sourceKeypoints.delete()
    targetKeypoints.delete()
    sourceDescriptors.delete()
    targetDescriptors.delete()
    matches.delete()
    srcPoints?.delete()
    dstPoints?.delete()
  }
}

function matchKeypoints(descriptors1: cv.Mat, descriptors2: cv.Mat): cv.DMatch[] {
  const matches = new cv.DMatchVectorVector()
  const goodMatches: cv.DMatch[] = []
  
  try {
    // Créer le matcher
    const matcher = new cv.BFMatcher()
    
    // Trouver les 2 meilleurs matches pour chaque descripteur
    matcher.knnMatch(descriptors1, descriptors2, matches, 2)
    
    // Appliquer le ratio test de Lowe
    for (let i = 0; i < matches.size(); i++) {
      const match = matches.get(i)
      if (match.get(0).distance < 0.7 * match.get(1).distance) {
        goodMatches.push(match.get(0))
      }
    }
    
    return goodMatches
  } finally {
    matches.delete()
  }
}

export async function analyzeImages(
  originImage: Mat,
  comparedImage: Mat
): Promise<AnalysisResult> {
  try {
    // 1. D'abord aligner l'image2 sur l'image1
    const alignmentResult = await alignImages(comparedImage, originImage)
    
    if (!alignmentResult.success) {
      return {
        matchedZone: { x: 0, y: 0, width: 0, height: 0 },
        degradationScore: 1.0,
        colorDifference: 0,
        visualData: {
          image1: null,
          image2: null,
          alignedImage: null
        },
        error: "Erreur lors de l'alignement des images"
      }
    }
    
    // 2. Maintenant on peut procéder à l'analyse sur des images alignées
    const result1 = await detectKeypoints(originImage)
    const result2 = await detectKeypoints(alignmentResult.alignedImage)
    
    // 3. Calculer le score de dégradation
    const matches = matchKeypoints(result1.descriptors, result2.descriptors)
    const score = calculateDegradationScore(matches, result1.keypoints, result2.keypoints)
    
    // 4. Calculer la zone correspondante
    const matchedZone = calculateMatchedZone(result1.keypoints, result2.keypoints, matches)
    
    // 5. Calculer la différence de couleur
    const colorDifference = calculateColorDifference(originImage, alignmentResult.alignedImage, matchedZone)
    
    return {
      matchedZone,
      degradationScore: score,
      colorDifference,
      visualData: {
        image1: matToBase64(result1.visualResult),
        image2: matToBase64(result2.visualResult),
        alignedImage: matToBase64(alignmentResult.alignedImage)
      }
    }
  } catch (error) {
    return {
      matchedZone: { x: 0, y: 0, width: 0, height: 0 },
      degradationScore: 0,
      colorDifference: 0,
      visualData: {
        image1: null,
        image2: null,
        alignedImage: null
      },
      error: error instanceof Error ? error.message : "Une erreur est survenue lors de l'analyse"
    }
  }
}

export async function detectKeypoints(image: Mat): Promise<{
  keypoints: cv.KeyPointVector;
  descriptors: cv.Mat;
  visualResult: cv.Mat;
}> {
  let gray = new cv.Mat()
  let visualResult = new cv.Mat()
  let keypoints = new cv.KeyPointVector()
  let descriptors = new cv.Mat()
  
  try {
    console.log("Début de la détection des points clés...")
    
    // Copier l'image d'entrée pour le résultat visuel
    image.copyTo(visualResult)
    
    // 1. Convertir l'image en niveaux de gris
    cv.cvtColor(image, gray, cv.COLOR_RGBA2GRAY)
    
    // 2. Initialiser le détecteur AKAZE
    const akaze = new cv.AKAZE()
    
    // 3. Détecter les points clés
    akaze.detect(gray, keypoints)
    
    // 4. Calculer les descripteurs
    akaze.compute(gray, keypoints, descriptors)

    // 5. Visualiser les points clés
    visualResult = visualizeKeypoints(image, keypoints)

    return {
      keypoints,
      descriptors,
      visualResult
    }
  } catch (error) {
    console.error("Erreur lors de la détection des points clés:", error)
    gray.delete()
    visualResult.delete()
    keypoints.delete()
    descriptors.delete()
    throw error
  }
}

function visualizeKeypoints(image: cv.Mat, keypoints: cv.KeyPointVector): cv.Mat {
  const visual = new cv.Mat()
  image.copyTo(visual)
  
  // Dessiner les points clés en rouge
  const color = new cv.Scalar(255, 0, 0, 255)
  for (let i = 0; i < keypoints.size(); i++) {
    const kp = keypoints.get(i)
    cv.circle(visual, kp.pt, 3, color, 1)
  }
  
  return visual
}

// Fonction utilitaire pour charger une image
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

// Filtrer les meilleurs matches
function filterGoodMatches(matches: cv.DMatchVector) {
  const distances = Array.from({ length: matches.size() }, (_, i) => matches.get(i).distance)
  const minDist = Math.min(...distances)
  const maxDist = Math.max(...distances)
  const threshold = minDist + 0.7 * (maxDist - minDist)

  return Array.from({ length: matches.size() }, (_, i) => matches.get(i))
    .filter(match => match.distance <= threshold)
}

// Calculer la zone correspondante
function calculateMatchedZone(keypoints1: cv.KeyPointVector, keypoints2: cv.KeyPointVector, goodMatches: cv.DMatch[]) {
  // Implémenter la logique pour déterminer la zone commune
  // Retourner les coordonnées de la zone
  return {
    x: 0,
    y: 0,
    width: 100,
    height: 100
  }
}

// Calculer le score de dégradation
function calculateDegradationScore(
  matches: cv.DMatch[],
  keypoints1: cv.KeyPointVector,
  keypoints2: cv.KeyPointVector
): number {
  // Si pas de correspondances, score maximum de dégradation
  if (matches.length === 0) return 1.0
  
  // Calculer le ratio de points correspondants
  const minKeypoints = Math.min(keypoints1.size(), keypoints2.size())
  const matchRatio = matches.length / minKeypoints
  
  // Inverser le ratio pour avoir un score de dégradation
  // (0 = pas de dégradation, 1 = dégradation totale)
  return 1.0 - matchRatio
}

// Calculer la différence de couleur
function calculateColorDifference(mat1: cv.Mat, mat2: cv.Mat, matchedZone: any) {
  // Implémenter la logique pour calculer la différence de couleur (ΔE)
  return 2.5
}

// Fonction utilitaire pour convertir une Mat en base64
export function matToBase64(mat: Mat): string {
  const canvas = document.createElement('canvas')
  const size = mat.size()
  canvas.width = size.width
  canvas.height = size.height
  
  cv.imshow(canvas, mat)
  
  return canvas.toDataURL('image/png')
} 