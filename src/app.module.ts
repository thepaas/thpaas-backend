import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { JwtAuthGuard } from './common/guards';
import { HttpValidationPipe } from './common/pipes';
import { ExceptionFilter } from './common/exceptions/exception.filter';
import { envValidator } from './common/config/env-schema';
import { EnvConfigModule } from './common/config/config.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { Web3Module } from './modules/web3/web3.module';
import { SocketModule } from './integrations/socket/socket.module';
import { Gateway } from './app.gateway';
import { WaltIdModule } from './integrations/waltid/waltid.module';
import { OidcModule } from './modules/oidc/oidc.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV
        ? `.env.${process.env.NODE_ENV as string}`
        : '.env',
      validationSchema: envValidator,
    }),
    DatabaseModule,
    SocketModule,
    WaltIdModule,
    HealthModule,
    AuthModule,
    UserModule,
    Web3Module,
    ServeStaticModule.forRoot({
      rootPath: join(
        __dirname,
        '../../../../../../',
        'node_modules/swagger-ui-dist',
      ),
    }),
    EnvConfigModule,
    OidcModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_PIPE,
      useClass: HttpValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },
    Gateway,
  ],
})
export class AppModule {}
