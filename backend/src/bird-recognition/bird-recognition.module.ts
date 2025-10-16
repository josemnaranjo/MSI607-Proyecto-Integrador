import { Module } from '@nestjs/common';
import { BirdRecognitionController } from './bird-recognition.controller';
import { BirdRecognitionService } from './bird-recognition.service';
import { MlService } from '../ml-service/ml-service.service';
import { BirdsModule } from '../birds/birds.module';

@Module({
  imports: [BirdsModule],
  controllers: [BirdRecognitionController],
  providers: [BirdRecognitionService, MlService],
})
export class BirdRecognitionModule {}
