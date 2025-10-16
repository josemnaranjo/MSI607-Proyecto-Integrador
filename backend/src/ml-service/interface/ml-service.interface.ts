export interface MLModelResponse {
  species: string;
  commonName: string;
  scientificName: string;
  confidence: number;
  alternatives?: Array<{ species: string; confidence: number }>;
}

export interface MLPredictionResult {
  id: string;
  species: string;
  commonName: string;
  scientificName: string;
  confidence: number;
  timestamp: string;
  alternativePredictions?: Array<{ species: string; confidence: number }>;
}
