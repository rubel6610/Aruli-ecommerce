import { SellerStatus } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

export class UpdateSellerStatusDto {
  @ApiProperty({ enum: SellerStatus, example: SellerStatus.APPROVED, description: 'Seller account status' })
  @IsEnum(SellerStatus)
  status!: SellerStatus;

  @ApiPropertyOptional({ example: 'admin-uuid-here', description: 'Admin user UUID who approved/rejected' })
  @IsUUID()
  @IsOptional()
  approvedById?: string;
}
