-- CreateEnum
CREATE TYPE "StatusApolice" AS ENUM ('ATIVA', 'VENCIDA');

-- CreateTable
CREATE TABLE "Pessoa" (
    "id_pessoa" SERIAL NOT NULL,
    "cpf_cnpj" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Pessoa_pkey" PRIMARY KEY ("id_pessoa")
);

-- CreateTable
CREATE TABLE "Imovel" (
    "id_imovel" SERIAL NOT NULL,
    "codigo_visual" INTEGER,
    "nome_imovel" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "id_locador" INTEGER NOT NULL,

    CONSTRAINT "Imovel_pkey" PRIMARY KEY ("id_imovel")
);

-- CreateTable
CREATE TABLE "Apolice" (
    "id_apolice" SERIAL NOT NULL,
    "numero_apolice" TEXT NOT NULL,
    "numero_proposta" TEXT,
    "seguradora" TEXT NOT NULL,
    "data_emissao" TIMESTAMP(3),
    "data_vencimento" TIMESTAMP(3),
    "status" "StatusApolice" NOT NULL,
    "data_pagamento" TIMESTAMP(3),
    "parcelamento" INTEGER,
    "id_imovel" INTEGER NOT NULL,
    "id_locatario" INTEGER NOT NULL,

    CONSTRAINT "Apolice_pkey" PRIMARY KEY ("id_apolice")
);

-- CreateTable
CREATE TABLE "AnexoApolice" (
    "id_anexo" SERIAL NOT NULL,
    "id_apolice" INTEGER NOT NULL,
    "nome_arquivo" TEXT NOT NULL,
    "caminho" TEXT NOT NULL,
    "content_type" TEXT,
    "tamanho_bytes" INTEGER,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnexoApolice_pkey" PRIMARY KEY ("id_anexo")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pessoa_cpf_cnpj_key" ON "Pessoa"("cpf_cnpj");

-- CreateIndex
CREATE INDEX "Imovel_nome_imovel_idx" ON "Imovel"("nome_imovel");

-- CreateIndex
CREATE UNIQUE INDEX "Apolice_numero_apolice_key" ON "Apolice"("numero_apolice");

-- CreateIndex
CREATE INDEX "Apolice_numero_apolice_idx" ON "Apolice"("numero_apolice");

-- CreateIndex
CREATE INDEX "Apolice_id_imovel_idx" ON "Apolice"("id_imovel");

-- CreateIndex
CREATE INDEX "Apolice_id_locatario_idx" ON "Apolice"("id_locatario");

-- CreateIndex
CREATE INDEX "AnexoApolice_id_apolice_idx" ON "AnexoApolice"("id_apolice");

-- AddForeignKey
ALTER TABLE "Imovel" ADD CONSTRAINT "Imovel_id_locador_fkey" FOREIGN KEY ("id_locador") REFERENCES "Pessoa"("id_pessoa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Apolice" ADD CONSTRAINT "Apolice_id_imovel_fkey" FOREIGN KEY ("id_imovel") REFERENCES "Imovel"("id_imovel") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Apolice" ADD CONSTRAINT "Apolice_id_locatario_fkey" FOREIGN KEY ("id_locatario") REFERENCES "Pessoa"("id_pessoa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnexoApolice" ADD CONSTRAINT "AnexoApolice_id_apolice_fkey" FOREIGN KEY ("id_apolice") REFERENCES "Apolice"("id_apolice") ON DELETE RESTRICT ON UPDATE CASCADE;
