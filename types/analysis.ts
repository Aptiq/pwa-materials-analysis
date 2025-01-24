export interface MatchedZone {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type AnalysisResults = {
  matchedZone: MatchedZone | null;
  degradationScore: number;
  colorDifference: number;
}

export interface VisualData {
  image1: string;
  image2: string;
  alignedImage: string;
  originalKeypoints?: string;
  comparedKeypoints?: string;
  keypointsOrigin?: string;
  keypointsCompared?: string;
  alignedOrigin?: string;
  alignedCompared?: string;
}

export interface Analysis {
  id: string
  originSubjectId: string
  comparedSubjectId: string
  matchedZone: any
  degradationScore: number | null
  colorDifference: number | null
  visualData: VisualData | null
  createdAt: Date
  // ... autres champs si nécessaire
}