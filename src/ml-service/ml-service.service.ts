import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BirdRecognitionResponseDto } from '../bird-recognition/dto/upload-audio.dto';

interface MLModelResponse {
  species: string;
  commonName: string;
  scientificName: string;
  confidence: number;
  alternatives?: Array<{ species: string; confidence: number }>;
}

@Injectable()
export class MlService {
  private readonly logger = new Logger(MlService.name);
  private readonly mlEndpoint: string;
  private readonly mlApiKey: string;

  constructor(private configService: ConfigService) {
    this.mlEndpoint = this.configService.get<string>('ML_MODEL_ENDPOINT');
    this.mlApiKey = this.configService.get<string>('ML_MODEL_API_KEY');

    if (!this.mlEndpoint) {
      this.logger.warn(
        'ML Model endpoint not configured. Predictions will use mock data.',
      );
    }
  }

  async predictBirdSpecies(
    audioBuffer: Buffer,
    audioUrl: string,
  ): Promise<BirdRecognitionResponseDto> {
    if (!this.mlEndpoint) {
      return this.getMockPrediction(audioUrl);
    }

    try {
      const formData = new FormData();
      // Convierte Buffer a Uint8Array que es compatible con Blob
      const audioBlob = new Blob([new Uint8Array(audioBuffer)], {
        type: 'audio/wav',
      });
      formData.append('audio', audioBlob, 'audio.wav');

      const response = await fetch(this.mlEndpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.mlApiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`ML Model returned status ${response.status}`);
      }

      const prediction: MLModelResponse = await response.json();

      return {
        id: this.generateId(),
        species: prediction.species,
        commonName: prediction.commonName,
        scientificName: prediction.scientificName,
        confidence: prediction.confidence,
        audioUrl: audioUrl,
        timestamp: new Date().toISOString(),
        alternativePredictions: prediction.alternatives,
      };
    } catch (error) {
      this.logger.error('Failed to get prediction from ML model', error);
      throw new Error('Bird recognition failed');
    }
  }

  private getMockPrediction(audioUrl: string): BirdRecognitionResponseDto {
    this.logger.warn('Using mock prediction - ML endpoint not configured');

    const mockBirds = [
      {
        species: 'Chucao',
        commonName: 'Chucao Tapaculo',
        scientificName: 'Scelorchilus rubecula',
        confidence: 0.92,
      },
      {
        species: 'Zorzal',
        commonName: 'Austral Thrush',
        scientificName: 'Turdus falcklandii',
        confidence: 0.87,
      },
      {
        species: 'Diuca',
        commonName: 'Common Diuca-Finch',
        scientificName: 'Diuca diuca',
        confidence: 0.85,
      },
      {
        species: 'Cachudito',
        commonName: 'White-crested Elaenia',
        scientificName: 'Elaenia albiceps',
        confidence: 0.79,
      },
    ];

    const primary = mockBirds[Math.floor(Math.random() * mockBirds.length)];
    const alternatives = mockBirds
      .filter((b) => b.species !== primary.species)
      .slice(0, 2)
      .map((b) => ({ species: b.commonName, confidence: b.confidence }));

    return {
      id: this.generateId(),
      species: primary.species,
      commonName: primary.commonName,
      scientificName: primary.scientificName,
      confidence: primary.confidence,
      audioUrl: audioUrl,
      timestamp: new Date().toISOString(),
      alternativePredictions: alternatives,
    };
  }

  private generateId(): string {
    return `bird_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
