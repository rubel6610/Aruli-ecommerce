import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Payment } from '../domain/entities/payment.entity';
import { OrderPlacedEvent } from '../../orders/application/orders.service';

export class PaymentCompletedEvent {
  constructor(public readonly orderId: string, public readonly paymentId: string) {}
}

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly payments: Payment[] = [];

  constructor(private readonly eventEmitter: EventEmitter2) {}

  @OnEvent('order.placed', { async: true })
  async handleOrderPlacedEvent(event: OrderPlacedEvent) {
    this.logger.log(`Processing payment of $${event.amount} for Order ID: ${event.orderId}...`);

    // Simulate payment processing delay and success
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const payment = new Payment({
      id: Math.random().toString(36).substring(2, 9),
      orderId: event.orderId,
      amount: event.amount,
      status: 'success',
      transactionId: `txn_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date(),
    });

    this.payments.push(payment);
    this.logger.log(`Payment successful for Order ID: ${event.orderId}. Txn ID: ${payment.transactionId}`);

    // Emit event asynchronously
    this.eventEmitter.emit('payment.completed', new PaymentCompletedEvent(event.orderId, payment.id));
  }
}
