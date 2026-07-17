export class OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export class Order {
  id: string;
  customerId: string; // Refers to User ID
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'completed' | 'cancelled';
  createdAt: Date;

  constructor(partial: Partial<Order>) {
    Object.assign(this, partial);
  }
}
