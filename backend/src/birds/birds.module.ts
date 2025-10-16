import { Module } from '@nestjs/common';
import { BirdsService } from './birds.service';

@Module({
  providers: [BirdsService],
  exports: [BirdsService],
})
export class BirdsModule {}
