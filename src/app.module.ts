import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { PessoaModule } from './pessoa/pessoa.module';
import { ImovelModule } from './imovel/imovel.module';
import { ApoliceModule } from './apolice/apolice.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [PrismaModule, PessoaModule, ImovelModule, ApoliceModule, HealthModule],
})
export class AppModule {}
