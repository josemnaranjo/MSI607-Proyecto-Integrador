import { Injectable, Logger } from '@nestjs/common';
import { MlService } from '../ml-service/ml-service.service';
import { BirdRecognitionResponseDto } from './dto/upload-audio.dto';

@Injectable()
export class BirdRecognitionService {
  private readonly logger = new Logger(BirdRecognitionService.name);

  constructor(private readonly mlService: MlService) {}

  async processAudio(
    file: Express.Multer.File,
    metadata?: { location?: string; recordedAt?: string },
  ): Promise<BirdRecognitionResponseDto> {
    this.logger.log(`Processing audio file: ${file.originalname}`);

    try {
      // Enviar directamente al ML model sin almacenar
      const prediction = await this.mlService.predictBirdSpecies(file.buffer);

      this.logger.log(
        `Bird identified: ${prediction.species} (confidence: ${prediction.confidence})`,
      );

      // Log metadata si existe (sin almacenar)
      if (metadata?.location || metadata?.recordedAt) {
        this.logger.log(`Metadata: ${JSON.stringify(metadata)}`);
      }

      return prediction;
    } catch (error) {
      this.logger.error('Error processing audio', error);
      throw error;
    }
  }
}
