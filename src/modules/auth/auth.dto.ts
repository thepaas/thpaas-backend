import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsHexadecimal,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty()
  @IsEmail()
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  public email: string;
}

export class SignUpDto {
  @ApiProperty({
    description: 'Account address',
    example: '0x0123456789abcdef...',
  })
  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  public accountAddress: string;
}

export class GenerateNonceDto {
  @ApiProperty({
    description: 'Account address',
    example: '0x0123456789abcdef...',
  })
  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  public accountAddress: string;
}

export class SignInDto {
  @ApiProperty({
    type: [String],
    description: 'Array of signed messages corresponding to the challenge.',
    example: ['0x1234...', '0xabcd...'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  public signedMessage: string[];

  @ApiProperty({
    description: 'The original jwt.',
  })
  @IsString()
  public jwt: string;
}

export class Web3JwtWithNonceDto {
  @ApiProperty()
  @IsString()
  public jwt: string;
}

export class RefreshDto {
  @ApiProperty({ name: 'refresh_token' })
  @IsUUID()
  public refreshToken: string;
}

export class AuthDto {
  @ApiProperty({ name: 'refresh_token' })
  public refreshToken: string;
  @ApiProperty({ name: 'access_token' })
  public accessToken: string;
}

export class ApiKeyDto {
  @ApiProperty({ name: 'api_key' })
  @IsString()
  public apiKey: string;
}
