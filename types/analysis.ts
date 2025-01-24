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
  originalKeypoints: string
  comparedKeypoints: string
  originalCount: number
  comparedCount: number
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