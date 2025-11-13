// backend/src/prisma/prisma-exception.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ConflictException,
  NotFoundException,
  BadRequestException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Erros específicos do Prisma (P2002, P2025, P2003...)
    if (exception && typeof exception === 'object' && 'code' in exception) {
      const code = (exception as any).code;

      // P2002: unique
      if (code === 'P2002') {
        const fields = ((exception as any).meta?.target as string[]) || [];
        const message =
          fields.length > 0
            ? `Já existe registro com os valores informados em: ${fields.join(', ')}`
            : 'Registro duplicado.';

        const error = new ConflictException(message);

        return response.status(error.getStatus()).json({
          statusCode: error.getStatus(),
          message: error.message,
          error: 'Conflict',
        });
      }

      // P2025: registro não encontrado (update/delete/findUniqueOrThrow)
      if (code === 'P2025') {
        const error = new NotFoundException('Registro não encontrado.');
        return response.status(error.getStatus()).json({
          statusCode: error.getStatus(),
          message: error.message,
          error: 'Not Found',
        });
      }

      // P2003: violação de FK (relacionamento inválido)
      if (code === 'P2003') {
        const error = new BadRequestException(
          'Registro relacionado não encontrado. Verifique se imóvel e pessoa existem antes de criar a apólice.',
        );
        return response.status(error.getStatus()).json({
          statusCode: error.getStatus(),
          message: error.message,
          error: 'Bad Request',
        });
      }

      // Outros códigos → erro genérico de banco
      console.error('[Prisma error]', exception);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Erro ao acessar o banco de dados.',
        error: 'Database Error',
      });
    }

    // HttpException padrão do Nest
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      return response.status(status).json(body);
    }

    // Fallback
    console.error('[Unhandled exception]', exception);
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Erro interno no servidor.',
      error: 'Internal Server Error',
    });
  }
}
