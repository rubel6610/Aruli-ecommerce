import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderPlacedEvent } from '../../orders/application/orders.service';
import { PaymentCompletedEvent } from '../../payments/application/payments.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  @OnEvent('order.placed', { async: true })
  async handleOrderPlacedEvent(event: OrderPlacedEvent) {
    this.logger.log(
      `Sending "Order Confirmed" notification to Customer ID: ${event.customerId} for Order ID: ${event.orderId}...`,
    );
    // Simulate email delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.logger.log(`"Order Confirmed" notification successfully sent to Customer ID: ${event.customerId}`);
  }

  @OnEvent('payment.completed', { async: true })
  async handlePaymentCompletedEvent(event: PaymentCompletedEvent) {
    this.logger.log(
      `Sending "Invoice Paid" notification for Order ID: ${event.orderId} (Payment ID: ${event.paymentId})...`,
    );
    // Simulate email delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.logger.log(`"Invoice Paid" notification successfully sent for Order ID: ${event.orderId}`);
  }
}
