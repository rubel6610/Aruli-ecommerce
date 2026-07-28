import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { SellerService } from './seller.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerStatusDto } from './dto/update-seller-status.dto';
import { SellerStatus } from '@prisma/client';

@Controller('sellers')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Post('register')
  async register(@Body() dto: CreateSellerDto) {
    return this.sellerService.registerSeller(dto);
  }

  @Get()
  async findAll(@Query('status') status?: SellerStatus) {
    return this.sellerService.findAll(status);
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string) {
    return this.sellerService.findByUserId(userId);
  }

  @Get('store/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.sellerService.findBySlug(slug);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateSellerStatusDto,
  ) {
    return this.sellerService.updateSellerStatus(id, dto);
  }
}
