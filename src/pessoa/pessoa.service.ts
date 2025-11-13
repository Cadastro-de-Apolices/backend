// src/pessoa/pessoa.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';

@Injectable()
export class PessoaService {
  constructor(private prisma: PrismaService) {}

  create(data: CreatePessoaDto) {
    return this.prisma.pessoa.create({ data });
  }

  findAll() {
    return this.prisma.pessoa.findMany();
  }

  findOne(id: number) {
    return this.prisma.pessoa.findUnique({
      where: { id_pessoa: id },
    });
  }

  update(id: number, data: UpdatePessoaDto) {
    return this.prisma.pessoa.update({
      where: { id_pessoa: id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.pessoa.delete({
      where: { id_pessoa: id },
    });
  }
}
