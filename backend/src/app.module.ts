import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { BirdRecognitionModule } from './bird-recognition/bird-recognition.module';
import { BirdsModule } from './birds/birds.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    HealthModule,
    BirdRecognitionModule,
    BirdsModule,
  ],
})
export class AppModule {}
