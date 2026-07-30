import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { SellerService } from './seller.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerStatusDto } from './dto/update-seller-status.dto';
import { SellerStatus } from '@prisma/client';

@ApiTags('Sellers')
@Controller('sellers')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @ApiOperation({ summary: 'Register a seller profile' })
  @ApiResponse({ status: 201, description: 'Seller profile created.' })
  @Post('register')
  async register(@Body() dto: CreateSellerDto) {
    return this.sellerService.registerSeller(dto);
  }

  @ApiOperation({ summary: 'Get list of sellers, optionally filtered by status' })
  @ApiQuery({ name: 'status', enum: SellerStatus, required: false, description: 'Filter sellers by status' })
  @ApiResponse({ status: 200, description: 'List of sellers.' })
  @Get()
  async findAll(@Query('status') status?: SellerStatus) {
    return this.sellerService.findAll(status);
  }

  @ApiOperation({ summary: 'Get seller profile by user ID' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'Seller profile details.' })
  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string) {
    return this.sellerService.findByUserId(userId);
  }

  @ApiOperation({ summary: 'Get seller profile by store slug' })
  @ApiParam({ name: 'slug', description: 'Store slug (e.g. aruli-electronics)' })
  @ApiResponse({ status: 200, description: 'Seller profile details.' })
  @Get('store/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.sellerService.findBySlug(slug);
  }

  @ApiOperation({ summary: 'Update seller status (Approve, Reject, Suspend)' })
  @ApiParam({ name: 'id', description: 'Seller profile UUID' })
  @ApiResponse({ status: 200, description: 'Seller status updated.' })
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateSellerStatusDto,
  ) {
    return this.sellerService.updateSellerStatus(id, dto);
  }
}
