import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UploadAudioDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Audio file (MP3, WAV, FLAC, OGG)',
  })
  @IsNotEmpty()
  file: Express.Multer.File;

  @ApiProperty({
    required: false,
    description: 'Optional metadata about the recording location',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    required: false,
    description: 'Optional timestamp of the recording',
  })
  @IsOptional()
  @IsString()
  recordedAt?: string;
}

export class BirdRecognitionResponseDto {
  @ApiProperty({ description: 'Unique identifier for this recognition' })
  id: string;

  @ApiProperty({ description: 'Detected bird species' })
  species: string;

  @ApiProperty({ description: 'Common name of the bird' })
  commonName: string;

  @ApiProperty({ description: 'Scientific name of the bird' })
  scientificName: string;

  @ApiProperty({ description: 'Confidence score (0-1)' })
  confidence: number;

  @ApiProperty({ description: 'Processing timestamp' })
  timestamp: string;

  @ApiProperty({
    description: 'Additional predictions with lower confidence',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        species: { type: 'string' },
        confidence: { type: 'number' },
      },
    },
  })
  alternativePredictions?: Array<{ species: string; confidence: number }>;
}
