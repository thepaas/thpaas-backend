import { Global, Module } from '@nestjs/common';
import { WaltIdService } from './waltid.service';
import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
  providers: [WaltIdService],
  exports: [WaltIdService],
  imports: [HttpModule]
})
export class WaltIdModule {}
