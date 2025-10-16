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

export class BirdDetails {
  @ApiProperty({ description: 'URL of bird image' })
  image: string;

  @ApiProperty({ description: 'Size of the bird' })
  size: string;

  @ApiProperty({ description: 'Weight of the bird' })
  weight: string;

  @ApiProperty({ description: 'Color description' })
  colors: string;

  @ApiProperty({ description: 'Habitat information' })
  habitat: string;
}

export class Alternative {
  @ApiProperty({ description: 'Species name' })
  species: string;

  @ApiProperty({ description: 'Confidence score' })
  confidence: number;
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
    type: [Alternative],
  })
  alternativePredictions?: Alternative[];

  @ApiProperty({
    description: 'Detailed information about the bird',
    type: BirdDetails,
  })
  details: BirdDetails;
}
