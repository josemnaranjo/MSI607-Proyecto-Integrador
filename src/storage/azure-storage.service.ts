import { Injectable, Logger } from '@nestjs/common';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AzureStorageService {
  private readonly logger = new Logger(AzureStorageService.name);
  private containerClient: ContainerClient;

  constructor(private configService: ConfigService) {
    const connectionString = this.configService.get<string>(
      'AZURE_STORAGE_CONNECTION_STRING',
    );
    const containerName =
      this.configService.get<string>('AZURE_STORAGE_CONTAINER_NAME') ||
      'bird-audios';

    if (!connectionString) {
      this.logger.warn(
        'Azure Storage connection string not configured. File upload will fail.',
      );
      return;
    }

    try {
      const blobServiceClient =
        BlobServiceClient.fromConnectionString(connectionString);
      this.containerClient =
        blobServiceClient.getContainerClient(containerName);
      this.ensureContainerExists();
    } catch (error) {
      this.logger.error('Failed to initialize Azure Storage client', error);
    }
  }

  private async ensureContainerExists() {
    try {
      await this.containerClient.createIfNotExists({
        access: 'blob',
      });
      this.logger.log('Azure Storage container is ready');
    } catch (error) {
      this.logger.error('Failed to create container', error);
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    if (!this.containerClient) {
      throw new Error('Azure Storage is not configured');
    }

    const fileExtension = file.originalname.split('.').pop();
    const blobName = `${uuidv4()}.${fileExtension}`;
    const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);

    try {
      await blockBlobClient.uploadData(file.buffer, {
        blobHTTPHeaders: {
          blobContentType: file.mimetype,
        },
      });

      this.logger.log(`File uploaded successfully: ${blobName}`);
      return blockBlobClient.url;
    } catch (error) {
      this.logger.error('Failed to upload file to Azure Storage', error);
      throw new Error('File upload failed');
    }
  }

  async deleteFile(blobUrl: string): Promise<void> {
    if (!this.containerClient) {
      throw new Error('Azure Storage is not configured');
    }

    try {
      const blobName = blobUrl.split('/').pop();
      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
      await blockBlobClient.delete();
      this.logger.log(`File deleted successfully: ${blobName}`);
    } catch (error) {
      this.logger.error('Failed to delete file from Azure Storage', error);
      throw new Error('File deletion failed');
    }
  }
}
