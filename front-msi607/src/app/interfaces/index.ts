export interface Alternative {
  name: string;
  confidence: number;
}

export interface BirdDetails {
  image: string;
  size: string;
  weight: string;
  colors: string;
}

export interface IdentificationResult {
  confidence: number;
  commonName: string;
  scientificName: string;
  alternatives: Alternative[];
  details: BirdDetails;
}

export interface ExpandedSections {
  characteristics: boolean;
}

export interface FileValidation {
  valid: boolean;
  error?: string;
}
