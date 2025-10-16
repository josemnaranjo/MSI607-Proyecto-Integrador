import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { MongoClient, Db, Collection } from 'mongodb';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MongoDBService implements OnModuleInit {
  private client: MongoClient;
  private db: Db;
  private readonly logger = new Logger(MongoDBService.name);

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const connectionString = this.configService.get<string>('MONGODB_URI');

    if (!connectionString) {
      this.logger.error('MONGODB_URI not configured');
      throw new Error('MONGODB_URI is required');
    }

    this.client = new MongoClient(connectionString);

    try {
      await this.client.connect();
      this.db = this.client.db('birdsDB');
      this.logger.log('✅ Connected to MongoDB');
    } catch (error) {
      this.logger.error('❌ Failed to connect to MongoDB', error);
      throw error;
    }
  }

  getCollection(name: string): Collection {
    return this.db.collection(name);
  }

  async findOne(collectionName: string, query: any): Promise<any> {
    const collection = this.getCollection(collectionName);
    return collection.findOne(query);
  }

  async find(collectionName: string, query: any = {}): Promise<any[]> {
    const collection = this.getCollection(collectionName);
    return collection.find(query).toArray();
  }
}
