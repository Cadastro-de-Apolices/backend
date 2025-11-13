// src/apolice/apolice.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApoliceDto } from './dto/create-apolice.dto';
import { UpdateApoliceDto } from './dto/update-apolice.dto';
import { StatusApolice, Prisma } from '@prisma/client';
import type { Express, Response } from 'express';
import { join } from 'path';


@Injectable()
export class ApoliceService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateApoliceDto) {
    const data: Prisma.ApoliceCreateInput = {
      numero_apolice: dto.numero_apolice,
      numero_proposta: dto.numero_proposta,
      seguradora: dto.seguradora,
      data_emissao: dto.data_emissao ? new Date(dto.data_emissao) : null,
      data_vencimento: dto.data_vencimento ? new Date(dto.data_vencimento) : null,
      status: dto.status,
      data_pagamento: dto.data_pagamento ? new Date(dto.data_pagamento) : null,
      parcelamento: dto.parcelamento ?? null,
      imovel: { connect: { id_imovel: dto.id_imovel } },
      locatario: { connect: { id_pessoa: dto.id_locatario } },
    };

    return this.prisma.apolice.create({
      data,
      include: {
        imovel: { include: { locador: true } },
        locatario: true,
        anexos: true,
      },
    });
  }

  // lista com filtros opcionais
  async findAll(params?: {
    status?: StatusApolice;
    ordenarPor?: 'vencimento' | 'emissao';
  }) {
    const where: Prisma.ApoliceWhereInput = {};
    if (params?.status) {
      where.status = params.status;
    }

    const orderBy: Prisma.ApoliceOrderByWithRelationInput[] = [];

    if (params?.ordenarPor === 'vencimento') {
      orderBy.push({ data_vencimento: 'asc' });
    } else if (params?.ordenarPor === 'emissao') {
      orderBy.push({ data_emissao: 'desc' });
    } else {
      orderBy.push({ id_apolice: 'desc' });
    }

    return this.prisma.apolice.findMany({
      where,
      orderBy,
      include: {
        imovel: { include: { locador: true } },
        locatario: true,
        _count: {
          select: { anexos: true },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.apolice.findUniqueOrThrow({
      where: { id_apolice: id },
      include: {
        imovel: { include: { locador: true } },
        locatario: true,
        anexos: true,
        _count: {
          select: { anexos: true },
        },
      },
    });
  }

  async update(id: number, dto: UpdateApoliceDto) {
    const data: Prisma.ApoliceUpdateInput = {
      numero_apolice: dto.numero_apolice,
      numero_proposta: dto.numero_proposta,
      seguradora: dto.seguradora,
      status: dto.status,
      parcelamento: dto.parcelamento,
    };

    if (dto.data_emissao !== undefined) {
      data.data_emissao = dto.data_emissao ? new Date(dto.data_emissao) : null;
    }
    if (dto.data_vencimento !== undefined) {
      data.data_vencimento = dto.data_vencimento ? new Date(dto.data_vencimento) : null;
    }
    if (dto.data_pagamento !== undefined) {
      data.data_pagamento = dto.data_pagamento ? new Date(dto.data_pagamento) : null;
    }

    if (dto.id_imovel) {
      data.imovel = { connect: { id_imovel: dto.id_imovel } };
    }

    if (dto.id_locatario) {
      data.locatario = { connect: { id_pessoa: dto.id_locatario } };
    }

    return this.prisma.apolice.update({
      where: { id_apolice: id },
      data,
      include: {
        imovel: { include: { locador: true } },
        locatario: true,
        anexos: true,
        _count: {
          select: { anexos: true },
        },
      },
    });
  }

  async remove(id: number) {
    return this.prisma.apolice.delete({
      where: { id_apolice: id },
    });
  }

  // --------- ANEXOS ---------

  async addAnexo(id_apolice: number, file: Express.Multer.File) {
    return this.prisma.anexoApolice.create({
      data: {
        id_apolice,
        nome_arquivo: file.originalname,
        // normaliza para barra / mesmo no Windows
        caminho: file.path.replace(/\\/g, '/'),
        content_type: file.mimetype,
        tamanho_bytes: file.size,
      },
    });
  }

  async listarAnexos(id_apolice: number) {
    return this.prisma.anexoApolice.findMany({
      where: { id_apolice },
      orderBy: { criado_em: 'desc' },
    });
  }

  async downloadAnexo(id_anexo: number, res: Response) {
    const anexo = await this.prisma.anexoApolice.findUnique({
      where: { id_anexo },
    });

    if (!anexo) {
      throw new NotFoundException('Anexo não encontrado.');
    }

    // caminho salvo pelo multer (ex.: ./uploads/apolices/arquivo.pdf)
    const relativePath = anexo.caminho.replace(/^\.\//, '');
    const filePath = join(process.cwd(), relativePath);

    return res.download(filePath, anexo.nome_arquivo);
  }


  async removerAnexo(id_apolice: number, id_anexo: number) {
    const anexo = await this.prisma.anexoApolice.findUnique({
      where: { id_anexo },
    });

    // garante que existe e pertence à apólice informada
    if (!anexo || anexo.id_apolice !== id_apolice) {
      throw new NotFoundException('Anexo não encontrado para esta apólice.');
    }

    // se quiser, aqui é o lugar de apagar o arquivo físico do disco (fs.unlink)

    await this.prisma.anexoApolice.delete({
      where: { id_anexo },
    });

    return { message: 'Anexo excluído com sucesso.' };
  }


async buscar(termo: string) {
  const termoLimpo = termo?.trim();
  if (!termoLimpo) {
    // se não mandar termo, reaproveita sua listagem padrão
    return this.findAll();
  }

  // só dígitos (pra bater em CPF/CNPJ, CEP etc.)
  const termoNumerico = termoLimpo.replace(/\D/g, '');

  const include = {
    imovel: { include: { locador: true } },
    locatario: true,
    _count: {
      select: { anexos: true },
    },
  } as const;

  // 1) CASO ESPECIAL: busca começando com "#" => filtra só por codigo_visual
  if (termoLimpo.startsWith('#') && termoNumerico) {
    const codigo = Number(termoNumerico);

    const apolices = await this.prisma.apolice.findMany({
      where: {
        imovel: {
          codigo_visual: codigo,
        },
      },
      include,
      orderBy: {
        data_vencimento: 'desc',
      },
    });

    return apolices.map((ap) => ({
      imovel: {
        id_imovel: ap.imovel.id_imovel,
        codigo_visual: ap.imovel.codigo_visual,
        nome_imovel: ap.imovel.nome_imovel,
        cep: ap.imovel.cep,
      },
      locador: ap.imovel.locador,
      locatario: ap.locatario,
      apoliceAtual: {
        id_apolice: ap.id_apolice,
        numero_apolice: ap.numero_apolice,
        numero_proposta: ap.numero_proposta,
        seguradora: ap.seguradora,
        data_emissao: ap.data_emissao,
        data_vencimento: ap.data_vencimento,
        status: ap.status,
        data_pagamento: ap.data_pagamento,
        parcelamento: ap.parcelamento,
        qtdAnexos: ap._count?.anexos ?? 0,
      },
    }));
  }

  // 2) CASO GERAL: busca “inteligente” em apólice + imóvel + pessoas
  const where: Prisma.ApoliceWhereInput = {
    OR: [
      // -------- CAMPOS DA APÓLICE --------
      {
        numero_apolice: {
          contains: termoLimpo,
          mode: 'insensitive',
        },
      },
      {
        numero_proposta: {
          contains: termoLimpo,
          mode: 'insensitive',
        },
      },
      {
        seguradora: {
          contains: termoLimpo,
          mode: 'insensitive',
        },
      },

      // -------- CAMPOS DO IMÓVEL --------
      {
        imovel: {
          OR: [
            {
              nome_imovel: {
                contains: termoLimpo,
                mode: 'insensitive',
              },
            },
            // codigo_visual: aqui só entra se o usuário digitou SÓ número (ex: "2")
            termoNumerico && /^\d+$/.test(termoLimpo)
              ? {
                  codigo_visual: Number(termoNumerico),
                }
              : undefined,
            // CEP (string) – usa os dígitos
            termoNumerico
              ? {
                  cep: {
                    contains: termoNumerico,
                  },
                }
              : undefined,
          ].filter(Boolean) as any,
        },
      },

      // -------- LOCATÁRIO (PESSOA) --------
      {
        locatario: {
          OR: [
            {
              nome: {
                contains: termoLimpo,
                mode: 'insensitive',
              },
            },
            termoNumerico
              ? {
                  cpf_cnpj: {
                    contains: termoNumerico,
                  },
                }
              : undefined,
          ].filter(Boolean) as any,
        },
      },

      // -------- LOCADOR (PESSOA via IMÓVEL) --------
      {
        imovel: {
          locador: {
            OR: [
              {
                nome: {
                  contains: termoLimpo,
                  mode: 'insensitive',
                },
              },
              termoNumerico
                ? {
                    cpf_cnpj: {
                      contains: termoNumerico,
                    },
                  }
                : undefined,
            ].filter(Boolean) as any,
          },
        },
      },
    ],
  };

  const apolices = await this.prisma.apolice.findMany({
    where,
    include,
    orderBy: {
      data_vencimento: 'desc',
    },
  });

  return apolices.map((ap) => ({
    imovel: {
      id_imovel: ap.imovel.id_imovel,
      codigo_visual: ap.imovel.codigo_visual,
      nome_imovel: ap.imovel.nome_imovel,
      cep: ap.imovel.cep,
    },
    locador: ap.imovel.locador,
    locatario: ap.locatario,
    apoliceAtual: {
      id_apolice: ap.id_apolice,
      numero_apolice: ap.numero_apolice,
      numero_proposta: ap.numero_proposta,
      seguradora: ap.seguradora,
      data_emissao: ap.data_emissao,
      data_vencimento: ap.data_vencimento,
      status: ap.status,
      data_pagamento: ap.data_pagamento,
      parcelamento: ap.parcelamento,
      qtdAnexos: ap._count?.anexos ?? 0,
    },
  }));
}

}
