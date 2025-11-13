// src/imovel/imovel.controller.ts
import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ImovelService } from './imovel.service';
import { CreateImovelDto } from './dto/create-imovel.dto';
import { UpdateImovelDto } from './dto/update-imovel.dto';

@Controller('imoveis')
export class ImovelController {
  constructor(private readonly imovelService: ImovelService) {}

  @Post()
  create(@Body() createImovelDto: CreateImovelDto) {
    return this.imovelService.create(createImovelDto);
  }

  @Get()
  findAll() {
    return this.imovelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imovelService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImovelDto: UpdateImovelDto) {
    return this.imovelService.update(+id, updateImovelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imovelService.remove(+id);
  }
}
