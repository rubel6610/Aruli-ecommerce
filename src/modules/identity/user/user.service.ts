import { Injectable } from '@nestjs/common';
import { User, UserStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });
  }

  async create(data: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    passwordHash: string;
  }): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        password: data.passwordHash,
        status: UserStatus.ACTIVE,
      },
    });
  }
}
