import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '../domain/entities/product.entity';

@Injectable()
export class CatalogService {
  private readonly products: Product[] = [];

  async findAll(): Promise<Product[]> {
    return this.products;
  }

  async findOne(id: string): Promise<Product | undefined> {
    return this.products.find((product) => product.id === id);
  }

  async create(product: Partial<Product>): Promise<Product> {
    const newProduct = new Product({
      id: Math.random().toString(36).substring(2, 9),
      name: product.name,
      price: product.price || 0,
      description: product.description || '',
      vendorId: product.vendorId,
      stock: product.stock || 0,
      createdAt: new Date(),
    });
    this.products.push(newProduct);
    return newProduct;
  }

  async decrementStock(productId: string, quantity: number): Promise<void> {
    const product = this.products.find((p) => p.id === productId);
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    if (product.stock < quantity) {
      throw new Error(`Insufficient stock for product ${product.name}`);
    }
    product.stock -= quantity;
  }
}
