import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { BirdRecognitionService } from './bird-recognition.service';
import {
  BirdRecognitionResponseDto,
  UploadAudioDto,
} from './dto/upload-audio.dto';

@ApiTags('bird-recognition')
@Controller('bird-recognition')
export class BirdRecognitionController {
  constructor(
    private readonly birdRecognitionService: BirdRecognitionService,
  ) {}

  @Post('identify')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload audio file and identify bird species' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Audio file with optional metadata',
    type: UploadAudioDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Bird species identified successfully',
    type: BirdRecognitionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid file format or missing file',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error during processing',
  })
  async identifyBird(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { location?: string; recordedAt?: string },
  ): Promise<BirdRecognitionResponseDto> {
    if (!file) {
      throw new BadRequestException('No audio file provided');
    }

    const allowedMimeTypes = [
      'audio/mpeg',
      'audio/wav',
      'audio/wave',
      'audio/x-wav',
      'audio/flac',
      'audio/ogg',
      'audio/mp3',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`,
      );
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 50MB limit');
    }

    return this.birdRecognitionService.processAudio(file, {
      location: body.location,
      recordedAt: body.recordedAt,
    });
  }
}
