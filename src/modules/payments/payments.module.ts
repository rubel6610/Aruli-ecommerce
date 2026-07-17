import { Module } from '@nestjs/common';
import { PaymentsService } from './application/payments.service';

@Module({
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
