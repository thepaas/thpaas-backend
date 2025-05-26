import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpStatus, Injectable, Req } from '@nestjs/common';

import { UserEntity } from '../../user/user.entity';
import {
  LOGOUT_PATH,
} from '../../../common/constants';
import { UserStatus } from '../../../common/enums/user';
import { UserRepository } from '../../user/user.repository';
import { CustomHttpError } from '../../../common/errors/controlled';
import { TokenRepository } from '../token.repository';
import { TokenType } from '../token.entity';
import { TPConfigService } from '../../../common/config/tp-config.service';

@Injectable()
export class JwtHttpStrategy extends PassportStrategy(Strategy, 'jwt-http') {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository,
    private readonly tpConfigService: TPConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: tpConfigService.jwtPublicKey,
      passReqToCallback: true,
    });
  }

  public async validate(
    @Req() request: any,
    payload: { userId: number },
  ): Promise<UserEntity> {
    const user = await this.userRepository.findById(payload.userId);

    if (!user) {
      throw new CustomHttpError('User not found', HttpStatus.UNAUTHORIZED);
    }

    if (
      user.status !== UserStatus.ACTIVE &&
      request.url !== LOGOUT_PATH
    ) {
      throw new CustomHttpError('User not active', HttpStatus.UNAUTHORIZED);
    }

    const token = await this.tokenRepository.findOneByUserIdAndType(
      user.id,
      TokenType.REFRESH,
    );

    if (!token) {
      throw new CustomHttpError(
        'User is not authorized',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }
}
