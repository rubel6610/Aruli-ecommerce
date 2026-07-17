export class Payment {
  id: string;
  orderId: string; // Reference to Order ID
  amount: number;
  status: 'pending' | 'success' | 'failed';
  transactionId: string;
  createdAt: Date;

  constructor(partial: Partial<Payment>) {
    Object.assign(this, partial);
  }
}
