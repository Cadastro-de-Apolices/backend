// src/pessoa/dto/create-pessoa.dto.ts
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreatePessoaDto {
  @IsNotEmpty({ message: 'CPF/CNPJ é obrigatório.' })
  @IsString()
  @Matches(/^\d{11}$|^\d{14}$/, {
    message: 'CPF/CNPJ deve conter 11 (CPF) ou 14 (CNPJ) dígitos numéricos.',
  })
  cpf_cnpj: string;

  @IsNotEmpty({ message: 'Nome é obrigatório.' })
  @IsString()
  @Length(3, 120, { message: 'Nome deve ter entre 3 e 120 caracteres.' })
  nome: string;
}
