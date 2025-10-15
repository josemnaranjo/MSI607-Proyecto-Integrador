import { Injectable, Logger } from '@nestjs/common';
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
  private readonly mlEndpoint: string =
    'http://bird-ml-api-sg.brazilsouth.azurecontainer.io:8000/predict';

  constructor() {
    this.logger.log(`ML Model endpoint configured: ${this.mlEndpoint}`);
  }

  async predictBirdSpecies(
    audioBuffer: Buffer,
  ): Promise<BirdRecognitionResponseDto> {
    try {
      const formData = new FormData();
      const audioBlob = new Blob([new Uint8Array(audioBuffer)], {
        type: 'audio/wav',
      });
      formData.append('audio', audioBlob, 'audio.wav');

      this.logger.log('Sending audio to ML model...');

      const response = await fetch(this.mlEndpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`ML Model error: ${response.status} - ${errorText}`);
        throw new Error(`ML Model returned status ${response.status}`);
      }

      const prediction: MLModelResponse = await response.json();

      this.logger.log(
        `Prediction received: ${prediction.species} (${prediction.confidence})`,
      );

      return {
        id: this.generateId(),
        species: prediction.species,
        commonName: prediction.commonName,
        scientificName: prediction.scientificName,
        confidence: prediction.confidence,
        timestamp: new Date().toISOString(),
        alternativePredictions: prediction.alternatives,
      };
    } catch (error) {
      this.logger.error('Failed to get prediction from ML model', error);
      this.logger.warn('Falling back to mock prediction');
      return this.getMockPrediction();
    }
  }

  private getMockPrediction(): BirdRecognitionResponseDto {
    this.logger.warn('Using mock prediction - ML model unavailable');

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
      timestamp: new Date().toISOString(),
      alternativePredictions: alternatives,
    };
  }

  private generateId(): string {
    return `bird_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
