// src/imovel/imovel.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateImovelDto } from './dto/create-imovel.dto';
import { UpdateImovelDto } from './dto/update-imovel.dto';

@Injectable()
export class ImovelService {
  constructor(private prisma: PrismaService) {}

  // cria já gerando o codigo_visual sequencial
  async create(createImovelDto: CreateImovelDto) {
    const ultimo = await this.prisma.imovel.findFirst({
      orderBy: { codigo_visual: 'desc' },
      select: { codigo_visual: true },
    });

    const proximoCodigo = (ultimo?.codigo_visual ?? 0) + 1;

    const { nome_imovel, cep, id_locador } = createImovelDto;

    return this.prisma.imovel.create({
      data: {
        nome_imovel,
        cep,
        id_locador,
        codigo_visual: proximoCodigo,
      },
    });
  }

  findAll() {
    return this.prisma.imovel.findMany();
  }

  findOne(id: number) {
    return this.prisma.imovel.findUnique({
      where: { id_imovel: id },
    });
  }

  async update(id: number, updateImovelDto: UpdateImovelDto) {
    const { nome_imovel, cep, id_locador } = updateImovelDto;

    return this.prisma.imovel.update({
      where: { id_imovel: id },
      data: {
        ...(nome_imovel !== undefined ? { nome_imovel } : {}),
        ...(cep !== undefined ? { cep } : {}),
        ...(id_locador !== undefined ? { id_locador } : {}),
      },
    });
  }

  remove(id: number) {
    return this.prisma.imovel.delete({
      where: { id_imovel: id },
    });
  }
}
