import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  Logger,
  HttpCode,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiTags,
  ApiResponse,
  ApiBody,
  ApiOperation,
} from '@nestjs/swagger';
import { Public } from '../../common/decorators';
import {
  AuthDto,
  SignInDto,
  RefreshDto,
  Web3JwtWithNonceDto,
  SignUpDto,
  GenerateNonceDto,
} from './auth.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards';
import { RequestWithUser } from '../../common/types';
import { TokenRepository } from './token.repository';
import { TokenType } from './token.entity';

@ApiTags('Auth')
@ApiResponse({
  status: 400,
  description: 'Bad Request. Invalid input parameters.',
})
@ApiResponse({
  status: 401,
  description: 'Unauthorized. Missing or invalid credentials.',
})
@ApiResponse({
  status: 404,
  description: 'Not Found. Could not find the requested content.',
})
@ApiResponse({
  status: 422,
  description: 'Unprocessable entity.',
})
@Controller('/auth')
export class AuthJwtController {
  private readonly logger = new Logger(AuthJwtController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly tokenRepository: TokenRepository,
  ) {}

  @Public()
  @Post('/web3/nonce')
  @ApiOperation({
    summary: 'Web3 Nonce Generation',
    description:
      'Generates a unique nonce returned as a JWT token, enabling Web3 authentication.',
  })
  @ApiBody({ type: SignUpDto })
  @ApiResponse({
    status: 200,
    description:
      'Nonce generated and returned as a JWT for authentication.',
    type: Web3JwtWithNonceDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request. The provided input parameters are invalid or incomplete.',
  })
  @ApiResponse({
    status: 422,
    description:
      'Unprocessable Entity. Failed to generate nonce due to internal processing issues.',
  })
  public async generateNonce(@Body() data: GenerateNonceDto): Promise<Web3JwtWithNonceDto> {
    return this.authService.generateNonce(data);
  }

  @Public()
  @Post('/web3/signup')
  @ApiOperation({
    summary: 'User Sign-Up with Web3 Nonce Generation',
    description:
      'Registers a new user.',
  })
  @ApiBody({ type: SignUpDto })
  @ApiResponse({
    status: 200,
    description:
      'User successfully created.',
    type: Web3JwtWithNonceDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request. The provided input parameters are invalid or incomplete.',
  })
  @ApiResponse({
    status: 422,
    description:
      'Unprocessable Entity. Failed to generate nonce due to internal processing issues.',
  })
  public async signup(@Body() data: SignUpDto): Promise<void> {
    await this.authService.signup(data);
  }

  @Public()
  @HttpCode(200)
  @Post('/web3/signin')
  @ApiOperation({
    summary: 'Web3 Sign-In',
    description:
      "Verifies the user's signature against the provided challenge and public key. If valid, authenticates the user and returns an access token.",
  })
  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: 200,
    description:
      'User authenticated successfully. A valid access token is returned.',
    type: AuthDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid or incomplete authentication data.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized. Signature verification failed or user not recognized.',
  })
  @ApiResponse({
    status: 422,
    description: 'Unprocessable Entity. Error during authentication process.',
  })
  public signin(@Body() data: SignInDto): Promise<AuthDto> {
    return this.authService.signin(data);
  }

  @Public()
  @HttpCode(200)
  @Post('/refresh-token')
  @ApiBody({ type: RefreshDto })
  @ApiOperation({
    summary: 'Refresh Token',
    description: 'Endpoint to refresh the authentication token.',
  })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    type: AuthDto,
  })
  public async refreshToken(@Body() data: RefreshDto): Promise<AuthDto> {
    return this.authService.refresh(data);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Post('/logout')
  @ApiOperation({
    summary: 'User Logout',
    description: 'Endpoint to log out the user.',
  })
  @ApiResponse({
    status: 204,
    description: 'User logged out successfully',
  })
  public async logout(@Req() request: RequestWithUser): Promise<void> {
    await this.tokenRepository.deleteOneByTypeAndUserId(
      TokenType.REFRESH,
      request.user.id,
    );
  }
}
