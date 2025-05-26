import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TPConfigService } from './tp-config.service';

@Global()
@Module({
  providers: [ConfigService, TPConfigService],
  exports: [ConfigService, TPConfigService],
})
export class EnvConfigModule {}
