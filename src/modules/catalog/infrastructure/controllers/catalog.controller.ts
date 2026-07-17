import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { CatalogService } from '../../application/catalog.service';
import { Product } from '../../domain/entities/product.entity';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  async findAll(): Promise<Product[]> {
    return this.catalogService.findAll();
  }

  @Post()
  async create(
    @Body() createProductDto: { name: string; price: number; description?: string; vendorId: string; stock: number },
  ): Promise<Product> {
    return this.catalogService.create(createProductDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    const product = await this.catalogService.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }
}
