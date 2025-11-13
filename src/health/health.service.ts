// src/health/health.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private prisma: PrismaService) {}

  appStatus() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  async dbStatus() {
    await this.prisma.$queryRaw`SELECT 1`;
    return {
      database: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
