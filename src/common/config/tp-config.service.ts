import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Network } from '../enums/network';

@Injectable()
export class TPConfigService {
  constructor(private configService: ConfigService) {}

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV', 'development');
  }

  get serverHost(): string {
    return this.configService.get<string>('HOST', 'localhost');
  }

  get serverPort(): number {
    return +this.configService.get<number>('PORT', 5000);
  }

  get appUrl(): string {
    return this.configService.get<string>('APP_URL', 'http://localhost:3001');
  }

  get appName(): string {
    return this.configService.get<string>('APP_NAME', 'ThePaaS');
  }

  get appVersion(): string {
    return this.configService.get<string>('APP_VERSION', '0.0.1');
  }

  get jwtPrivateKey(): string {
    return this.configService.get<string>('JWT_PRIVATE_KEY', '');
  }

  get jwtPublicKey(): string {
    return this.configService.get<string>('JWT_PUBLIC_KEY', '');
  }

  get accessTokenExpiresIn(): number {
    return +this.configService.get<number>('JWT_ACCESS_TOKEN_EXPIRES_IN', 600);
  }

  get refreshTokenExpiresIn(): number {
    return +this.configService.get<number>('REFRESH_TOKEN_EXPIRES_IN', 3600);
  }

  get verifyEmailTokenExpiresIn(): number {
    return +this.configService.get<number>(
      'VERIFY_EMAIL_TOKEN_EXPIRES_IN',
      86400,
    );
  }

  get forgotPasswordExpiresIn(): number {
    return +this.configService.get<number>(
      'FORGOT_PASSWORD_TOKEN_EXPIRES_IN',
      86400,
    );
  }

  get postgresUrl(): string | undefined {
    return this.configService.get<string>('POSTGRES_URL');
  }

  get postgresHost(): string {
    return this.configService.get<string>('POSTGRES_HOST', '127.0.0.1');
  }

  get postgresPort(): number {
    return +this.configService.get<number>('POSTGRES_PORT', 5432);
  }

  get postgresUser(): string {
    return this.configService.get<string>('POSTGRES_USER', 'operator');
  }

  get postgresPassword(): string {
    return this.configService.get<string>('POSTGRES_PASSWORD', 'qwerty');
  }

  get postgresDatabase(): string {
    return this.configService.get<string>('POSTGRES_DATABASE', 'thepaas-backend');
  }

  get postgresSsl(): boolean {
    return this.configService.get<string>('POSTGRES_SSL', 'false') === 'true';
  }

  get postgresLogging(): string {
    return this.configService.get<string>('POSTGRES_LOGGING', '');
  }

  get accountPrivateKey(): string {
    return this.configService.get<string>('ACCOUNT_PRIVATE_KEY', '');
  }

  get accountAddress(): string {
    return this.configService.get<string>('ACCOUNT_ADDRESS', '');
  }

  get gasPriceMultiplier(): number {
    return +this.configService.get<number>('GAS_PRICE_MULTIPLIER', 1);
  }

  get chainId(): string {
    return this.configService.get<string>('CHAIN_ID', '');
  }

  get network(): Network {
    return this.configService.get<Network>('NETWORK', Network.sepolia);
  }

  get rpcUrl(): string {
    return this.configService.get<string>('RPC_URL', '');
  }

  get accountClassHash(): string {
    return this.configService.get<string>('ACCOUNT_CLASS_HASH', '');
  }

  get ethTokenAddress(): string {
    return this.configService.get<string>('ETH_TOKEN_ADDRESS', '');
  }

  get strkTokenAddress(): string {
    return this.configService.get<string>('STRK_TOKEN_ADDRESS', '');
  }

  get nftTokenUri(): string {
    return this.configService.get<string>('NFT_TOKEN_URI', '');
  }
  
  get waltidBaseUrl(): string {
    return this.configService.get<string>('WALTID_BASE_URL', '');
  }
  get waltidEmail(): string {
    return this.configService.get<string>('WALTID_EMAIL', '');
  }

  get waltidPassword(): string {
    return this.configService.get<string>('WALTID_PASSWORD', '');
  }
}
