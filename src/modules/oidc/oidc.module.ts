import { Module } from '@nestjs/common';
import { OidcService } from './oidc.service';
import { OidcController } from './oidc.controller';

@Module({
  providers: [OidcService],
  controllers: [OidcController],
  exports: [OidcService],
})
export class OidcModule {
  constructor() {}
}
