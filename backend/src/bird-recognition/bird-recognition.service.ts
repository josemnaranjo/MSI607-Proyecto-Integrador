import { Injectable, Logger } from '@nestjs/common';
import { MlService } from '../ml-service/ml-service.service';
import { BirdsService } from '../birds/birds.service';
import { BirdRecognitionResponseDto } from './dto/upload-audio.dto';

@Injectable()
export class BirdRecognitionService {
  private readonly logger = new Logger(BirdRecognitionService.name);

  constructor(
    private readonly mlService: MlService,
    private readonly birdsService: BirdsService,
  ) {}

  async processAudio(
    file: Express.Multer.File,
    metadata?: { location?: string; recordedAt?: string },
  ): Promise<BirdRecognitionResponseDto> {
    this.logger.log(`Processing audio file: ${file.originalname}`);

    try {
      const prediction = await this.mlService.predictBirdSpecies(file.buffer);

      this.logger.log(
        `Bird identified: ${prediction.species} (confidence: ${prediction.confidence})`,
      );

      const birdDetails = await this.birdsService.findBySpecies(
        prediction.species,
      );

      const enrichedResponse: BirdRecognitionResponseDto = {
        ...prediction,
        details: {
          image: birdDetails.image,
          size: birdDetails.size,
          weight: birdDetails.weight,
          colors: birdDetails.colors,
          habitat: birdDetails.habitat,
        },
      };

      if (metadata?.location || metadata?.recordedAt) {
        this.logger.log(`Metadata: ${JSON.stringify(metadata)}`);
      }

      return enrichedResponse;
    } catch (error) {
      this.logger.error('Error processing audio', error);
      throw error;
    }
  }
}
