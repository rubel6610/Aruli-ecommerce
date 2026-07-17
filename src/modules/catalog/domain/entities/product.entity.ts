export class Product {
  id: string;
  name: string;
  price: number;
  description: string;
  vendorId: string; // Reference to User id (Only by ID, no direct relation/join)
  stock: number;
  createdAt: Date;

  constructor(partial: Partial<Product>) {
    Object.assign(this, partial);
  }
}
