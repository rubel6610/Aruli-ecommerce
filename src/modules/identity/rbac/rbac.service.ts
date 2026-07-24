import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { AssignRoleDto } from './dto/assign-role.dto';

@Injectable()
export class RbacService {
  constructor(private readonly prisma: PrismaService) {}

  async createRole(dto: CreateRoleDto) {
    const existing = await this.prisma.role.findUnique({
      where: { name: dto.name },
    });
    if (existing) {
      throw new ConflictException(`Role '${dto.name}' already exists`);
    }

    const role = await this.prisma.role.create({
      data: {
        name: dto.name,
        isSystem: dto.isSystem ?? false,
      },
    });

    if (dto.permissionIds && dto.permissionIds.length > 0) {
      await this.prisma.rolePermission.createMany({
        data: dto.permissionIds.map((permissionId) => ({
          roleId: role.id,
          permissionId,
        })),
      });
    }

    return this.findRoleById(role.id);
  }

  async findRoleById(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });
    if (!role) throw new NotFoundException(`Role with ID ${id} not found`);
    return role;
  }

  async findAllRoles() {
    return this.prisma.role.findMany({
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  async createPermission(dto: CreatePermissionDto) {
    return this.prisma.permission.create({
      data: {
        name: dto.name,
        resource: dto.resource,
        action: dto.action,
      },
    });
  }

  async findAllPermissions() {
    return this.prisma.permission.findMany();
  }

  async assignRoleToUser(dto: AssignRoleDto) {
    const user = await this.prisma.user.findFirst({
      where: { id: dto.userId, deletedAt: null },
    });
    if (!user) throw new NotFoundException('User not found');

    const role = await this.prisma.role.findUnique({
      where: { id: dto.roleId },
    });
    if (!role) throw new NotFoundException('Role not found');

    const staff = await this.prisma.user.findFirst({
      where: { id: dto.assignedById, deletedAt: null },
    });
    if (!staff) throw new NotFoundException('Assigning staff user not found');

    return this.prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: dto.userId,
          roleId: dto.roleId,
        },
      },
      update: {
        assignedById: dto.assignedById,
      },
      create: {
        userId: dto.userId,
        roleId: dto.roleId,
        assignedById: dto.assignedById,
      },
      include: {
        role: true,
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
      },
    });
  }

  async removeRoleFromUser(userId: string, roleId: string) {
    await this.prisma.userRole.deleteMany({
      where: { userId, roleId },
    });
    return { message: 'Role revoked from user' };
  }

  async getUserPermissions(userId: string) {
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    const permissions = new Set<string>();
    userRoles.forEach((ur) => {
      ur.role.rolePermissions.forEach((rp) => {
        permissions.add(`${rp.permission.resource}:${rp.permission.action}`);
      });
    });

    return {
      userId,
      roles: userRoles.map((ur) => ur.role.name),
      permissions: Array.from(permissions),
    };
  }
}
