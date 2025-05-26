import { Injectable, Logger } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { UserStatus, UserRole } from '../../common/enums/user';
import { UserRepository } from './user.repository';
import { SignUpDto } from '../auth/auth.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private userRepository: UserRepository) {}

  public async create(dto: SignUpDto): Promise<UserEntity> {
    const newUser = new UserEntity();
    newUser.accountAddress = dto.accountAddress;
    newUser.role = UserRole.USER;
    newUser.status = UserStatus.PENDING;
    await this.userRepository.createUnique(newUser);
    return newUser;
  }
}
