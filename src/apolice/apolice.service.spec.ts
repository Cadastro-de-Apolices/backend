import { Test, TestingModule } from '@nestjs/testing';
import { ApoliceService } from './apolice.service';

describe('ApoliceService', () => {
  let service: ApoliceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApoliceService],
    }).compile();

    service = module.get<ApoliceService>(ApoliceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
