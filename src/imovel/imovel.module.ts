import { Module } from '@nestjs/common';
import { ImovelService } from './imovel.service';
import { ImovelController } from './imovel.controller';

@Module({
  providers: [ImovelService],
  controllers: [ImovelController]
})
export class ImovelModule {}
