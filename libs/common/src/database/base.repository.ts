import { NotFoundException, Logger } from '@nestjs/common';
import {
  Repository,
  FindOptionsWhere,
  DeepPartial,
  ObjectLiteral,
} from 'typeorm';

export abstract class AbstractRepository<T extends ObjectLiteral> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly repository: Repository<T>) {}

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async findOne(filter: FindOptionsWhere<T>): Promise<T> {
    const entity = await this.repository.findOneBy(filter);
    if (!entity) {
      this.logger.warn('Entity not found', filter);
      throw new NotFoundException('Entity not found');
    }
    return entity;
  }

  async findAll(filter?: FindOptionsWhere<T>): Promise<T[]> {
    return this.repository.find({ where: filter });
  }

  async update(
    filter: FindOptionsWhere<T>,
    update: DeepPartial<T>
  ): Promise<T> {
    const entity = await this.findOne(filter);
    const merged = this.repository.merge(entity, update);
    return this.repository.save(merged);
  }

  async delete(filter: FindOptionsWhere<T>): Promise<void> {
    const entity = await this.findOne(filter);
    await this.repository.remove(entity);
  }
}
