import { Injectable } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { BaseRepository } from '../../database/base.repository';
import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
  constructor(private dataSource: DataSource) {
    super(UserEntity, dataSource);
  }

  async findById(id: number): Promise<UserEntity | null> {
    return this.findOne({ where: { id }, relations: [] });
  }

  async findOneByAddress(accountAddress: string): Promise<UserEntity | null> {
    return this.findOne({
      where: { accountAddress: accountAddress.toLowerCase() },
    });
  }

  async findAllByIds(ids: number[]): Promise<UserEntity[]> {
    return this.find({
      where: { id: In(ids) },
      relations: [],
    });
  }
}
