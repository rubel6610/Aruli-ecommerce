import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CryptoUtil } from '../common/crypto.util';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UserStatus } from '../../../../prisma/generated';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async signUp(dto: SignUpDto) {
    const existing = await this.prisma.user.findFirst({
      where: { email: dto.email, deletedAt: null },
    });
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = CryptoUtil.hashPassword(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        password: hashedPassword,
        status: UserStatus.ACTIVE,
      },
    });

    const tokenSession = await this.createRefreshTokenSession(
      user.id,
      'Web Browser',
    );

    const { password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      refreshToken: tokenSession.rawToken,
      expiresAt: tokenSession.expiresAt,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email, deletedAt: null },
      include: {
        sellerProfile: true,
        userRoles: {
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
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException(`User account is ${user.status.toLowerCase()}`);
    }

    const isPasswordValid = CryptoUtil.comparePassword(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const deviceName = dto.deviceName || 'Unknown Device';
    const tokenSession = await this.createRefreshTokenSession(user.id, deviceName);

    const { password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      refreshToken: tokenSession.rawToken,
      expiresAt: tokenSession.expiresAt,
    };
  }

  async refreshTokens(dto: RefreshTokenDto) {
    const tokenHash = CryptoUtil.hashToken(dto.refreshToken);

    const existingToken = await this.prisma.refreshToken.findFirst({
      where: { tokenHash },
      include: { user: true },
    });

    if (!existingToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (new Date() > existingToken.expiresAt) {
      await this.prisma.refreshToken.delete({ where: { id: existingToken.id } });
      throw new UnauthorizedException('Refresh token has expired');
    }

    // Rotate token
    await this.prisma.refreshToken.delete({ where: { id: existingToken.id } });
    const newTokenSession = await this.createRefreshTokenSession(
      existingToken.userId,
      existingToken.deviceName,
    );

    return {
      refreshToken: newTokenSession.rawToken,
      expiresAt: newTokenSession.expiresAt,
    };
  }

  async logout(refreshToken: string) {
    const tokenHash = CryptoUtil.hashToken(refreshToken);
    await this.prisma.refreshToken.deleteMany({
      where: { tokenHash },
    });
    return { message: 'Logged out successfully' };
  }

  private async createRefreshTokenSession(userId: string, deviceName: string) {
    const rawToken = CryptoUtil.generateRandomToken(32);
    const tokenHash = CryptoUtil.hashToken(rawToken);

    // Default 30 days expiration
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        deviceName,
        expiresAt,
      },
    });

    return { rawToken, expiresAt };
  }
}
