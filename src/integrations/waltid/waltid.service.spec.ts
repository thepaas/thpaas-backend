import { Test, TestingModule } from '@nestjs/testing';
import { WaltIdService } from './waltid.service';

describe('WaltIdService', () => {
  let service: WaltIdService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WaltIdService],
    }).compile();

    service = module.get<WaltIdService>(WaltIdService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
