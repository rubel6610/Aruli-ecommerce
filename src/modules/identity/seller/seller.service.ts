/* eslint-disable prettier/prettier */
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerStatusDto } from './dto/update-seller-status.dto';
import { SellerStatus } from '@prisma/client';
@Injectable()
export class SellerService {
  constructor(private readonly prisma: PrismaService) {}

  async registerSeller(dto: CreateSellerDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: { id: dto.userId, deletedAt: null },
    });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const existingProfile = await this.prisma.sellerProfile.findFirst({
      where: { userId: dto.userId, deletedAt: null },
    });
    if (existingProfile) {
      throw new ConflictException('Seller profile already exists for this user');
    }

    const storeSlug = this.slugify(dto.storeName);
    const existingSlug = await this.prisma.sellerProfile.findFirst({
      where: { storeSlug },
    });
    const finalSlug = existingSlug
      ? `${storeSlug}-${Math.floor(1000 + Math.random() * 9000)}`
      : storeSlug;

    return this.prisma.sellerProfile.create({
      data: {
        userId: dto.userId,
        storeName: dto.storeName,
        storeSlug: finalSlug,
        businessEmail: dto.businessEmail,
        businessPhone: dto.businessPhone,
        commissionRate: dto.commissionRate ?? 10.0,
        status: SellerStatus.PENDING,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async findByUserId(userId: string) {
    const profile = await this.prisma.sellerProfile.findFirst({
      where: { userId, deletedAt: null },
      include: { user: true, approvedBy: true },
    });
    if (!profile) throw new NotFoundException('Seller profile not found');
    return profile;
  }

  async findBySlug(storeSlug: string) {
    const profile = await this.prisma.sellerProfile.findFirst({
      where: { storeSlug, deletedAt: null, status: SellerStatus.APPROVED },
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true },
        },
      },
    });
    if (!profile) throw new NotFoundException('Seller store not found');
    return profile;
  }

  async findAll(status?: SellerStatus) {
    return this.prisma.sellerProfile.findMany({
      where: {
        deletedAt: null,
        ...(status && { status }),
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        approvedBy: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateSellerStatus(id: string, dto: UpdateSellerStatusDto) {
    const profile = await this.prisma.sellerProfile.findFirst({
      where: { id, deletedAt: null },
    });
    if (!profile) throw new NotFoundException('Seller profile not found');

    return this.prisma.sellerProfile.update({
      where: { id },
      data: {
        status: dto.status,
        ...(dto.approvedById && { approvedById: dto.approvedById }),
      },
    });
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, '-');
  }
}
