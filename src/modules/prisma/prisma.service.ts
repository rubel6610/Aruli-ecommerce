import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  private static pool: Pool;
  private static adapter: PrismaPg;

  constructor() {
    if (!PrismaService.pool) {
      const url = process.env.DATABASE_URL || process.env.DIRECT_DATABASE_URL;
      if (!url) {
        throw new Error('DATABASE_URL or DIRECT_DATABASE_URL environment variable is missing.');
      }
      PrismaService.pool = new Pool({
        connectionString: url,
      });
      PrismaService.adapter = new PrismaPg(PrismaService.pool);
    }
    super({
      adapter: PrismaService.adapter,
    });
  }

  async onModuleInit() {
    this.logger.log('Connecting to PostgreSQL database via driver adapter...');
    await this.$connect();
    this.logger.log('Database connection established.');
  }

  async onModuleDestroy() {
    this.logger.log('Disconnecting from database...');
    await this.$disconnect();
    if (PrismaService.pool) {
      await PrismaService.pool.end();
    }
  }
}
