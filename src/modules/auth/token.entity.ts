import {
  Column,
  Entity,
  Generated,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { UserEntity } from '../user/user.entity';
import { BaseEntity } from '../../database/base.entity';
import { NS } from '../../common/constants';
import { IBase } from '../../common/interfaces/base';

export enum TokenType {
  NONCE = 'NONCE',
  REFRESH = 'REFRESH',
}

@Entity({ schema: NS, name: 'tokens' })
@Index(['type', 'userId'], { unique: true })
export class TokenEntity extends BaseEntity implements IBase {
  @Column({ type: 'uuid', unique: true })
  @Generated('uuid')
  uuid: string;

  @Column({ type: 'varchar', nullable: true })
  code: string;

  @Column({
    type: 'enum',
    enum: TokenType,
  })
  type: TokenType;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @JoinColumn()
  @ManyToOne(() => UserEntity, { eager: true })
  user: UserEntity;

  @Column({ type: 'int' })
  userId: number;
}
