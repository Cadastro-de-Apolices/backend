// src/imovel/dto/create-imovel.dto.ts
import { IsInt, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreateImovelDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 120)
  nome_imovel: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{8}$/, { message: 'CEP deve ter 8 dígitos numéricos.' })
  cep: string;

  @IsNotEmpty()
  @IsInt({ message: 'id_locador deve ser um número inteiro.' })
  id_locador: number;
}
