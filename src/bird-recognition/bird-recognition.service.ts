import { Injectable, Logger } from '@nestjs/common';
import { AzureStorageService } from '../storage/azure-storage.service';
import { MlService } from '../ml-service/ml-service.service';
import { BirdRecognitionResponseDto } from './dto/upload-audio.dto';

@Injectable()
export class BirdRecognitionService {
  private readonly logger = new Logger(BirdRecognitionService.name);

  constructor(
    private readonly azureStorageService: AzureStorageService,
    private readonly mlService: MlService,
  ) {}

  async processAudio(
    file: Express.Multer.File,
    metadata?: { location?: string; recordedAt?: string },
  ): Promise<BirdRecognitionResponseDto> {
    this.logger.log(`Processing audio file: ${file.originalname}`);

    try {
      // Upload audio to Azure Storage
      const audioUrl = await this.azureStorageService.uploadFile(file);
      this.logger.log(`Audio uploaded to: ${audioUrl}`);

      // Send to ML model for prediction
      const prediction = await this.mlService.predictBirdSpecies(
        file.buffer,
        audioUrl,
      );

      this.logger.log(
        `Bird identified: ${prediction.species} (confidence: ${prediction.confidence})`,
      );

      // You can store metadata in a database here if needed
      if (metadata?.location || metadata?.recordedAt) {
        this.logger.log(`Metadata received: ${JSON.stringify(metadata)}`);
      }

      return prediction;
    } catch (error) {
      this.logger.error('Error processing audio', error);
      throw error;
    }
  }
}
