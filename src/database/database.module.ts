import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { NS } from '../common/constants';
import { TokenEntity } from '../modules/auth/token.entity';
import { UserEntity } from '../modules/user/user.entity';

import { TypeOrmLoggerModule, TypeOrmLoggerService } from './typeorm';
import { LoggerOptions } from 'typeorm';
import { TPConfigService } from '../common/config/tp-config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [TypeOrmLoggerModule],
      inject: [TypeOrmLoggerService, TPConfigService],
      useFactory: (
        typeOrmLoggerService: TypeOrmLoggerService,
        tpConfigService: TPConfigService,
      ) => {
        const loggerOptions = tpConfigService.postgresLogging?.split(', ');
        typeOrmLoggerService.setOptions(
          loggerOptions && loggerOptions[0] === 'all'
            ? 'all'
            : ((loggerOptions as LoggerOptions) ?? false),
        );
        return {
          name: 'default',
          type: 'postgres',
          entities: [TokenEntity, UserEntity],
          // We are using migrations, synchronize should be set to false.
          synchronize: false,
          // Run migrations automatically,
          // you can disable this if you prefer running migration manually.
          migrationsTableName: NS,
          migrationsTransactionMode: 'each',
          namingStrategy: new SnakeNamingStrategy(),
          logging: true,
          // Allow both start:prod and start:dev to use migrations
          // __dirname is either dist or server folder, meaning either
          // the compiled js in prod or the ts in dev.
          migrations: [path.join(__dirname, '/migrations/**/*{.ts,.js}')],
          //"migrations": ["dist/migrations/*{.ts,.js}"],
          logger: typeOrmLoggerService,
          url: tpConfigService.postgresUrl,
          host: tpConfigService.postgresHost,
          port: tpConfigService.postgresPort,
          username: tpConfigService.postgresUser,
          password: tpConfigService.postgresPassword,
          database: tpConfigService.postgresDatabase,
          keepConnectionAlive: tpConfigService.nodeEnv === 'test',
          migrationsRun: false,
          ssl: tpConfigService.postgresSsl,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
