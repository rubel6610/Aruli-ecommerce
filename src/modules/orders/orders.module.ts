import { Module } from '@nestjs/common';
import { OrdersService } from './application/orders.service';
import { OrdersController } from './infrastructure/controllers/orders.controller';
import { CatalogModule } from '../catalog/catalog.module';

@Module({
  imports: [CatalogModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
