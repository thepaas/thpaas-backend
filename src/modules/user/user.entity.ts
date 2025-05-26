import { Column, Entity, Index } from 'typeorm';
import { NS } from '../../common/constants';
import { BaseEntity } from '../../database/base.entity';
import { UserStatus, UserRole } from '../../common/enums/user';

@Entity({ schema: NS, name: 'users' })
@Index(['accountAddress', 'socket'], { unique: true })
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', nullable: true, unique: true })
  email: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
  })
  status: UserStatus;

  @Column({ type: 'varchar', nullable: true, unique: true })
  accountAddress: string;

  @Column({ type: 'varchar', nullable: true, unique: true })
  socket: string;
}
