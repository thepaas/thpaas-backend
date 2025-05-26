import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { WaltIdAuthResponse, WaltIdLoginDto, WaltIdRegisterDto } from './waltid.dto';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from '@nestjs/terminus/dist/health-indicator/http/axios.interfaces';
import { TPConfigService } from '../../common/config/tp-config.service';

@Injectable()
export class WaltIdService {
  constructor(
    private readonly tpConfigService: TPConfigService,
    private readonly httpService: HttpService
  ) {}

  async register(data: WaltIdRegisterDto): Promise<any> {
    try {
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.post(`${this.tpConfigService.waltidBaseUrl}/register`, data, {
          headers: {
            'Content-Type': 'application/json',
            accept: '*/*',
          },
        }),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Registration failed',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(data: WaltIdLoginDto): Promise<WaltIdAuthResponse> {
    try {
      const response: AxiosResponse<WaltIdAuthResponse> = await firstValueFrom(
        this.httpService.post(`${this.tpConfigService.waltidBaseUrl}/login`, data, {
          headers: {
            'Content-Type': 'application/json',
            accept: '*/*',
          },
        }),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Login failed',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(
        this.httpService.post(
          `${this.tpConfigService.waltidBaseUrl}/logout`,
          {},
          {
            headers: {
              accept: '*/*',
            },
          },
        ),
      );
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Logout failed',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
