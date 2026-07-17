import { Module } from '@nestjs/common';
import { CatalogService } from './application/catalog.service';
import { CatalogController } from './infrastructure/controllers/catalog.controller';

@Module({
  controllers: [CatalogController],
  providers: [CatalogService],
  exports: [CatalogService],
})
export class CatalogModule {}
