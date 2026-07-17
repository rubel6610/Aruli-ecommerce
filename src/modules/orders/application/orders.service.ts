import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Order, OrderItem } from '../domain/entities/order.entity';
import { CatalogService } from '../../catalog/application/catalog.service';
import { PaymentCompletedEvent } from '../../payments/application/payments.service';

export class OrderPlacedEvent {
  constructor(public readonly orderId: string, public readonly amount: number, public readonly customerId: string) {}
}

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  private readonly orders: Order[] = [];

  constructor(
    private readonly catalogService: CatalogService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findOne(id: string): Promise<Order | undefined> {
    return this.orders.find((order) => order.id === id);
  }

  async createOrder(customerId: string, items: { productId: string; quantity: number }[]): Promise<Order> {
    const orderItems: OrderItem[] = [];
    let totalAmount = 0;

    // 1. Process items and verify stock
    for (const item of items) {
      const product = await this.catalogService.findOne(item.productId);
      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }

      // Check and decrement stock
      await this.catalogService.decrementStock(item.productId, item.quantity);

      const itemPrice = product.price * item.quantity;
      totalAmount += itemPrice;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // 2. Create the order
    const order = new Order({
      id: Math.random().toString(36).substring(2, 9),
      customerId,
      items: orderItems,
      totalAmount,
      status: 'pending',
      createdAt: new Date(),
    });

    this.orders.push(order);
    this.logger.log(`Order created: ${order.id}. Total: $${order.totalAmount}`);

    // 3. Emit "order.placed" event asynchronously
    this.eventEmitter.emit(
      'order.placed',
      new OrderPlacedEvent(order.id, order.totalAmount, order.customerId),
    );

    return order;
  }

  @OnEvent('payment.completed', { async: true })
  async handlePaymentCompletedEvent(event: PaymentCompletedEvent) {
    this.logger.log(`Received payment.completed event for Order ID: ${event.orderId}`);
    const order = this.orders.find((o) => o.id === event.orderId);
    if (!order) {
      this.logger.error(`Order ${event.orderId} not found to process payment completion`);
      return;
    }
    order.status = 'paid';
    this.logger.log(`Order ID: ${order.id} status updated to: ${order.status}`);
  }
}
