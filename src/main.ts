// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaExceptionFilter } from './prisma/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Definir origens permitidas (dev x prod)
  const isProd = process.env.NODE_ENV === 'production';

  const allowedOrigins = isProd
    ? [
        // URL do frontend em produção (configure no .env do backend)
        process.env.FRONTEND_URL ?? 'https://app-cadastro.vercel.app',
      ]
    : ['http://localhost:3000'];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  // Validação global dos DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Filtro global de erros (Prisma + HttpException)
  app.useGlobalFilters(new PrismaExceptionFilter());

const port = process.env.PORT || 3001;
await app.listen(port, '0.0.0.0');
console.log(`🚀 Backend rodando na porta ${port}`);

}
bootstrap();
