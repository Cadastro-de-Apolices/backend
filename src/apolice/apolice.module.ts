import { Module } from '@nestjs/common';
import { ApoliceService } from './apolice.service';
import { ApoliceController } from './apolice.controller';

@Module({
  providers: [ApoliceService],
  controllers: [ApoliceController]
})
export class ApoliceModule {}
