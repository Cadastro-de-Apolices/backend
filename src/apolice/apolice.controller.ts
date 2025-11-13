// src/apolice/apolice.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
  Res
} from '@nestjs/common';
import { ApoliceService } from './apolice.service';
import { CreateApoliceDto } from './dto/create-apolice.dto';
import { UpdateApoliceDto } from './dto/update-apolice.dto';
import { StatusApolice } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Express } from 'express';
import type { Response } from 'express';

@Controller('apolices')
export class ApoliceController {
  constructor(private readonly apoliceService: ApoliceService) {}

  @Post()
  create(@Body() dto: CreateApoliceDto) {
    return this.apoliceService.create(dto);
  }

  @Get()
  findAll(
    @Query('status') status?: StatusApolice,
    @Query('ordenarPor') ordenarPor?: 'vencimento' | 'emissao',
  ) {
    return this.apoliceService.findAll({ status, ordenarPor });
  }

  @Get('busca')
  buscar(@Query('termo') termo: string) {
    return this.apoliceService.buscar(termo);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.apoliceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateApoliceDto) {
    return this.apoliceService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.apoliceService.remove(+id);
  }

   // --------- UPLOAD DE ANEXO ---------
  @Post(':id/anexos')
  @UseInterceptors(
    FileInterceptor('arquivo', {
      storage: diskStorage({
        destination: './uploads/apolices',
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, unique + extname(file.originalname));
        },
      }),
    }),
  )
  async uploadAnexo(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.apoliceService.addAnexo(+id, file);
  }

  // --------- LISTAR ANEXOS DE UMA APÓLICE ---------
  @Get(':id/anexos')
  listarAnexos(@Param('id') id: string) {
    return this.apoliceService.listarAnexos(+id);
  }

  // --------- REMOVER ANEXO DE UMA APÓLICE ---------
  @Delete(':id/anexos/:anexoId')
  removerAnexo(
    @Param('id') id: string,
    @Param('anexoId') anexoId: string,
  ) {
    return this.apoliceService.removerAnexo(+id, +anexoId);
  }

    // --------- DOWNLOAD DE ANEXO ---------
  @Get('anexos/:anexoId/download')
  downloadAnexo(
    @Param('anexoId') anexoId: string,
    @Res() res: Response,
  ) {
    return this.apoliceService.downloadAnexo(+anexoId, res);
  }

}
