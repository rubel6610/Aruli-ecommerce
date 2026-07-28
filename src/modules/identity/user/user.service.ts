import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateAddressDto } from './dto/create-address.dto';

import { CryptoUtil } from '../common/crypto.util';
import { User, UserStatus } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }

  async findOne(id: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      include: {
        addresses: true,
        sellerProfile: true,
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) return null;
    const { password: _password, ...withoutPassword } = user;
    return withoutPassword;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { email, deletedAt: null },
    });
  }

  async create(data: CreateUserDto): Promise<Omit<User, 'password'>> {
    const hashedPassword = CryptoUtil.hashPassword(data.passwordHash);
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        password: hashedPassword,
        status: UserStatus.ACTIVE,
      },
    });

    const { password: _password, ...withoutPassword } = user;
    return withoutPassword;
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.firstName && { firstName: dto.firstName }),
        ...(dto.lastName && { lastName: dto.lastName }),
        ...(dto.phone && { phone: dto.phone }),
      },
    });

    const { password: _password, ...withoutPassword } = updated;
    return withoutPassword;
  }

  async softDeleteUser(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    await this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: UserStatus.INACTIVE,
      },
    });

    return { message: 'User account soft deleted successfully' };
  }

  // --- Address Management ---

  async addAddress(userId: string, dto: CreateAddressDto) {
    if (dto.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.create({
      data: {
        userId,
        fullName: dto.fullName,
        phone: dto.phone,
        country: dto.country,
        division: dto.division,
        district: dto.district,
        addressLine: dto.addressLine,
        isDefault: dto.isDefault ?? false,
      },
    });
  }

  async getUserAddresses(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async setDefaultAddress(userId: string, addressId: string) {
    const address = await this.prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) throw new NotFoundException('Address not found');

    await this.prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });

    return this.prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });
  }

  async deleteAddress(userId: string, addressId: string) {
    const address = await this.prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) throw new NotFoundException('Address not found');

    await this.prisma.address.delete({
      where: { id: addressId },
    });

    return { message: 'Address deleted successfully' };
  }
}
