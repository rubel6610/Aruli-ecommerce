import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'Admin', description: 'Role name' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: false, description: 'Is system role' })
  @IsBoolean()
  @IsOptional()
  isSystem?: boolean;

  @ApiPropertyOptional({ example: ['perm-uuid-1', 'perm-uuid-2'], description: 'List of permission IDs' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  permissionIds?: string[];
}
