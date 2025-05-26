/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ErrorAuth, ErrorUser } from '../../common/constants/errors';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import {
  AuthDto,
  GenerateNonceDto,
  RefreshDto,
  SignInDto,
  SignUpDto,
  Web3JwtWithNonceDto,
} from './auth.dto';
import { TokenEntity, TokenType } from './token.entity';
import { TokenRepository } from './token.repository';

import { UserRepository } from '../user/user.repository';
import { CustomHttpError } from '../../common/errors/controlled';
import { generateRandomNumber } from '../../common/utils';
import { TPConfigService } from '../../common/config/tp-config.service';
import { Web3Service } from '../web3/web3.service';
import { typedData, TypedData, TypedDataRevision } from 'starknet';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly tokenRepository: TokenRepository,
    private readonly tpConfigService: TPConfigService,
    private readonly userRepository: UserRepository,
    private readonly web3Service: Web3Service,
  ) {}

  public async signin(data: SignInDto): Promise<AuthDto> {
    const jwtPrivateKey = this.tpConfigService.jwtPrivateKey;

    const decodedJwt = this.jwtService.verify(data.jwt, {
      secret: jwtPrivateKey,
    });

    const userEntity = await this.userRepository.findOneByAddress(
      decodedJwt.accountAddress,
    );

    if (!userEntity) {
      throw new CustomHttpError(
        ErrorAuth.InvalidSignature,
        HttpStatus.FORBIDDEN,
      );
    }

    const nonceTokenEntity = await this.tokenRepository.findOneByUserIdAndType(
      userEntity.id,
      TokenType.NONCE,
    );

    if (!nonceTokenEntity || (nonceTokenEntity && nonceTokenEntity.code !== decodedJwt.nonce)) {
      throw new CustomHttpError(
        ErrorAuth.InvalidSignature,
        HttpStatus.FORBIDDEN,
      );
    }

    const messageStructure: TypedData = {
      domain: {
        name: this.tpConfigService.appName,
        chainId: this.tpConfigService.chainId,
        version: this.tpConfigService.appVersion,
        revision: TypedDataRevision.ACTIVE,
      },
      message: {
        nonce: nonceTokenEntity.code,
      },
      primaryType: 'Simple',
      types: {
        Simple: [
          {
            name: 'nonce',
            type: 'u128',
          },
        ],
        StarknetDomain: [
          {
            name: 'name',
            type: 'shortstring',
          },
          {
            name: 'chainId',
            type: 'shortstring',
          },
          {
            name: 'version',
            type: 'shortstring',
          },
          {
            name: 'revision',
            type: 'shortstring',
          },
        ],
      },
    };

    const provider = this.web3Service.getProvider();
    const msgHash = typedData.getMessageHash(
      messageStructure,
      BigInt(userEntity.accountAddress),
    );

    const result: boolean = await provider.verifyMessageInStarknet(
      msgHash,
      data.signedMessage,
      userEntity.accountAddress,
    );

    if (!result) {
      throw new CustomHttpError(
        ErrorAuth.InvalidSignature,
        HttpStatus.FORBIDDEN,
      );
    }

    return this.auth(userEntity);
  }

  public async signup(data: SignUpDto): Promise<void> {
    const storedUser = await this.userRepository.findOneByAddress(
      data.accountAddress,
    );
    if (storedUser) {
      throw new CustomHttpError(
        ErrorUser.DuplicatedAccountAddress,
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.userService.create(data);
  }

  public async generateNonce(data: GenerateNonceDto): Promise<Web3JwtWithNonceDto> {
    const storedUser = await this.userRepository.findOneByAddress(
      data.accountAddress,
    );
    if (!storedUser) {
      throw new CustomHttpError(
        ErrorUser.NotFound,
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingToken = await this.tokenRepository.findOne({
      where: {
        user: { id: storedUser.id },
        type: TokenType.NONCE,
      },
    });
  
    if (existingToken) {
      await this.tokenRepository.remove(existingToken);
    }
    
    const tokenEntity = new TokenEntity();
    tokenEntity.type = TokenType.NONCE;
    tokenEntity.user = storedUser;
    const date = new Date();
    tokenEntity.expiresAt = new Date(
      date.getTime() + this.tpConfigService.verifyEmailTokenExpiresIn * 1000,
    );
    const nonce = generateRandomNumber().toString();
    tokenEntity.code = nonce;
    await this.tokenRepository.createUnique(tokenEntity);

    const jwt = await this.jwtService.signAsync(
      {
        accountAddress: data.accountAddress,
        nonce,
      },
      {
        expiresIn: this.tpConfigService.accessTokenExpiresIn,
      },
    );

    return { jwt };
  }

  public async refresh(data: RefreshDto): Promise<AuthDto> {
    const tokenEntity = await this.tokenRepository.findOneByUuidAndType(
      data.refreshToken,
      TokenType.REFRESH,
    );

    if (!tokenEntity) {
      throw new CustomHttpError(ErrorAuth.InvalidToken, HttpStatus.FORBIDDEN);
    }

    if (new Date() > tokenEntity.expiresAt) {
      throw new CustomHttpError(ErrorAuth.TokenExpired, HttpStatus.FORBIDDEN);
    }

    return this.auth(tokenEntity.user);
  }

  public async auth(userEntity: UserEntity): Promise<AuthDto> {
    const refreshTokenEntity =
      await this.tokenRepository.findOneByUserIdAndType(
        userEntity.id,
        TokenType.REFRESH,
      );

    const accessToken = await this.jwtService.signAsync(
      {
        accountAddress: userEntity.accountAddress,
        userId: userEntity.id,
        status: userEntity.status,
      },
      {
        expiresIn: this.tpConfigService.accessTokenExpiresIn,
      },
    );

    if (refreshTokenEntity) {
      await this.tokenRepository.deleteOne(refreshTokenEntity);
    }

    const newRefreshTokenEntity = new TokenEntity();
    newRefreshTokenEntity.user = userEntity;
    newRefreshTokenEntity.type = TokenType.REFRESH;
    const date = new Date();
    newRefreshTokenEntity.expiresAt = new Date(
      date.getTime() + this.tpConfigService.refreshTokenExpiresIn * 1000,
    );

    await this.tokenRepository.createUnique(newRefreshTokenEntity);

    return { accessToken, refreshToken: newRefreshTokenEntity.uuid };
  }

  async authSocketClient(jwtToken: string, socketId: string): Promise<void> {
    const jwtPrivateKey = this.tpConfigService.jwtPrivateKey;

    const decodedJwt = this.jwtService.verify(jwtToken, {
      secret: jwtPrivateKey,
    });

    const user = await this.userRepository.findById(decodedJwt.userId);
    if (!user) {
      throw new CustomHttpError(ErrorUser.NotFound, HttpStatus.NOT_FOUND);
    }
    user.socket = socketId;

    await this.userRepository.save(user);
  }
}
