import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { StatusApolice } from '@prisma/client';

export class CreateApoliceDto {
  @IsNotEmpty()
  @IsString()
  numero_apolice: string;

  @IsOptional()
  @IsString()
  numero_proposta?: string;

  @IsNotEmpty()
  @IsString()
  seguradora: string;

  @IsOptional()
  @IsDateString()
  data_emissao?: string;

  @IsOptional()
  @IsDateString()
  data_vencimento?: string;

  @IsNotEmpty()
  @IsEnum(StatusApolice)
  status: StatusApolice; // 'ATIVA' | 'VENCIDA'

  @IsOptional()
  @IsDateString()
  data_pagamento?: string;

  @IsOptional()
  @IsInt()
  parcelamento?: number;

  @IsInt()
  id_imovel: number;

  @IsInt()
  id_locatario: number;
}
