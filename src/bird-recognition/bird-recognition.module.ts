import { Module } from '@nestjs/common';
import { BirdRecognitionController } from './bird-recognition.controller';
import { BirdRecognitionService } from './bird-recognition.service';
import { AzureStorageService } from '../storage/azure-storage.service';
import { MlService } from '../ml-service/ml-service.service';

@Module({
  controllers: [BirdRecognitionController],
  providers: [BirdRecognitionService, AzureStorageService, MlService],
})
export class BirdRecognitionModule {}
