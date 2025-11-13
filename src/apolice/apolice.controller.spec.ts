import { Test, TestingModule } from '@nestjs/testing';
import { ApoliceController } from './apolice.controller';

describe('ApoliceController', () => {
  let controller: ApoliceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApoliceController],
    }).compile();

    controller = module.get<ApoliceController>(ApoliceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
