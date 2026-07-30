import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  fullName!: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  phone!: string;

  @ApiProperty({ example: 'Bangladesh' })
  @IsString()
  country!: string;

  @ApiProperty({ example: 'Dhaka' })
  @IsString()
  division!: string;

  @ApiProperty({ example: 'Dhaka' })
  @IsString()
  district!: string;

  @ApiProperty({ example: 'House 12, Road 5, Block B' })
  @IsString()
  addressLine!: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
