import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { MongoDBService } from '../database/mongodb.service';

export interface Bird {
  species: string;
  commonName: string;
  scientificName: string;
  image: string;
  size: string;
  weight: string;
  colors: string;
  habitat: string;
}

@Injectable()
export class BirdsService {
  private readonly logger = new Logger(BirdsService.name);

  constructor(private readonly mongoDBService: MongoDBService) {}

  async findBySpecies(species: string): Promise<Bird> {
    this.logger.log(`Searching for bird: ${species}`);

    const bird = await this.mongoDBService.findOne('birds', {
      species: { $regex: new RegExp(`^${species}$`, 'i') },
    });

    if (!bird) {
      this.logger.warn(`Bird not found: ${species}`);
      throw new NotFoundException(
        `Bird species "${species}" not found in database`,
      );
    }

    return bird as Bird;
  }

  async findAll(): Promise<Bird[]> {
    return this.mongoDBService.find('birds');
  }
}
