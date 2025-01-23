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