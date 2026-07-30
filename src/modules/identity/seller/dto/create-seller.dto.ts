import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateSellerDto {
  @ApiProperty({ example: 'user-uuid-here', description: 'User UUID' })
  @IsUUID()
  userId!: string;

  @ApiProperty({ example: 'Aruli Electronics', description: 'Store name' })
  @IsString()
  storeName!: string;

  @ApiProperty({ example: 'seller@aruli.com', description: 'Business email' })
  @IsEmail()
  businessEmail!: string;

  @ApiProperty({ example: '1234567890', description: 'Business phone' })
  @IsString()
  businessPhone!: string;

  @ApiPropertyOptional({ example: 10.0, description: 'Commission rate percentage' })
  @IsNumber()
  @IsOptional()
  commissionRate?: number;
}
