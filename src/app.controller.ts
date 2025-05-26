import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiTags, ApiExcludeController } from '@nestjs/swagger';

import { Public } from './common/decorators';

@Controller('/')
@ApiExcludeController()
@ApiTags('Main')
export class AppController {
  @Public()
  @Get('/')
  @Redirect('/swagger', 301)
  public redirect(): void {}
}
