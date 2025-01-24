'use client'

export async function analyzeImages(image1Url: string, image2Url: string) {
  console.log("Début de l'analyse avec les URLs:", { image1Url, image2Url })
  
  if (typeof window === 'undefined') {
    throw new Error('Cette fonction doit être exécutée côté client')
  }

  const cv = window.cv
  if (!cv) {
    throw new Error("OpenCV n'est pas chargé")
  }

  try {
    // Charger les images
    console.log("Chargement des images...")
    const [img1, img2] = await Promise.all([
      loadImage(image1Url),
      loadImage(image2Url)
    ])
    console.log("Images chargées avec succès")

    // Convertir les images en matrices OpenCV
    console.log("Conversion en matrices OpenCV...")
    const mat1 = cv.imread(img1)
    const mat2 = cv.imread(img2)
    console.log("Matrices créées:", { 
      mat1Size: `${mat1.rows}x${mat1.cols}`,
      mat2Size: `${mat2.rows}x${mat2.cols}`
    })

    try {
      // Convertir en niveaux de gris
      console.log("Conversion en niveaux de gris...")
      const gray1 = new cv.Mat()
      const gray2 = new cv.Mat()
      cv.cvtColor(mat1, gray1, cv.COLOR_RGBA2GRAY)
      cv.cvtColor(mat2, gray2, cv.COLOR_RGBA2GRAY)

      // Détecter les points clés
      console.log("Détection des points clés...")
      const akaze = new cv.AKAZE()
      const keypoints1 = new cv.KeyPointVector()
      const keypoints2 = new cv.KeyPointVector()
      const descriptors1 = new cv.Mat()
      const descriptors2 = new cv.Mat()

      akaze.detectAndCompute(gray1, new cv.Mat(), keypoints1, descriptors1)
      akaze.detectAndCompute(gray2, new cv.Mat(), keypoints2, descriptors2)
      console.log("Points clés détectés:", {
        keypoints1: keypoints1.size(),
        keypoints2: keypoints2.size()
      })

      // Matcher les points clés
      const matcher = new cv.BFMatcher(cv.NORM_HAMMING)
      const matches = new cv.DMatchVector()
      matcher.match(descriptors1, descriptors2, matches)

      // Filtrer les meilleurs matches
      const goodMatches = filterGoodMatches(matches)

      // Calculer la zone correspondante
      const matchedZone = calculateMatchedZone(keypoints1, keypoints2, goodMatches)

      // Calculer le score de dégradation
      const degradationScore = calculateDegradationScore(mat1, mat2, matchedZone)

      // Calculer la différence de couleur
      const colorDifference = calculateColorDifference(mat1, mat2, matchedZone)

      // Calculer les résultats
      const results = {
        matchedZone,
        degradationScore,
        colorDifference
      }

      console.log("Analyse terminée avec succès:", results)
      return results

    } finally {
      // Libérer la mémoire
      mat1.delete()
      mat2.delete()
      console.log("Mémoire libérée")
    }
  } catch (error) {
    console.error("Erreur pendant l'analyse:", error)
    throw error
  }
}

export async function detectKeypoints(imageData: cv.Mat): Promise<{
  keypoints: cv.KeyPointVector;
  descriptors: cv.Mat;
  visualResult: cv.Mat;
}> {
  let gray = new cv.Mat()
  let visualResult = new cv.Mat()
  
  try {
    console.log("Début de la détection des points clés...")
    
    // Copier l'image d'entrée pour le résultat visuel
    imageData.copyTo(visualResult)
    
    // 1. Convertir l'image en niveaux de gris
    cv.cvtColor(imageData, gray, cv.COLOR_RGBA2GRAY)
    
    // 2. Initialiser le détecteur AKAZE
    const akaze = new cv.AKAZE()
    
    // 3. Détecter les points clés
    const keypoints = akaze.detect(gray)
    
    // 4. Calculer les descripteurs
    const descriptors = new cv.Mat()
    akaze.compute(gray, keypoints, descriptors)

    // 5. Visualiser les points clés
    visualResult = visualizeKeypoints(imageData, keypoints)

    return {
      keypoints,
      descriptors,
      visualResult
    }
  } catch (error) {
    gray.delete()
    visualResult.delete()
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
function calculateDegradationScore(mat1: cv.Mat, mat2: cv.Mat, matchedZone: any) {
  // Implémenter la logique pour calculer le score de dégradation
  return 0.5
}

// Calculer la différence de couleur
function calculateColorDifference(mat1: cv.Mat, mat2: cv.Mat, matchedZone: any) {
  // Implémenter la logique pour calculer la différence de couleur (ΔE)
  return 2.5
}

// Fonction utilitaire pour convertir une Mat en base64
export function matToBase64(mat: cv.Mat): string {
  const canvas = document.createElement('canvas')
  const size = mat.size()
  canvas.width = size.width
  canvas.height = size.height
  
  cv.imshow(canvas, mat)
  
  return canvas.toDataURL('image/png')
} 