import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user/user.module';
import { JwtHttpStrategy } from './strategy';
import { AuthService } from './auth.service';
import { AuthJwtController } from './auth.controller';
import { TokenEntity } from './token.entity';
import { TokenRepository } from './token.repository';
import { TPConfigService } from '../../common/config/tp-config.service';
import { UserEntity } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';
import { Web3Module } from '../web3/web3.module';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      inject: [TPConfigService],
      useFactory: (tpConfigService: TPConfigService) => ({
        privateKey: tpConfigService.jwtPrivateKey,
        signOptions: {
          algorithm: 'ES256',
          expiresIn: tpConfigService.accessTokenExpiresIn,
        },
      }),
    }),
    TypeOrmModule.forFeature([TokenEntity, UserEntity]),
    Web3Module,
  ],
  providers: [JwtHttpStrategy, AuthService, TokenRepository, UserRepository],
  controllers: [AuthJwtController],
  exports: [AuthService],
})
export class AuthModule {}
