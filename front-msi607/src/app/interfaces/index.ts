export interface Alternative {
  species: string;
  confidence: number;
}

export interface BirdDetails {
  image: string;
  size: string;
  weight: string;
  colors: string;
  habitat: string
}

export interface IdentificationResult {
  species: string;
  commonName: string;
  scientificName: string;
  confidence: number;
  alternativePredictions: Alternative[];
  details: BirdDetails;
}

export interface ExpandedSections {
  characteristics: boolean;
}

export interface FileValidation {
  valid: boolean;
  error?: string;
}
