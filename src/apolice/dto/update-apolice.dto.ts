// src/apolice/dto/update-apolice.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateApoliceDto } from './create-apolice.dto';

export class UpdateApoliceDto extends PartialType(CreateApoliceDto) {}
