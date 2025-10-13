import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { BirdRecognitionModule } from './bird-recognition/bird-recognition.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    HealthModule,
    BirdRecognitionModule,
  ],
})
export class AppModule {}
