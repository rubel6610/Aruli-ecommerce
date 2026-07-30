import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ example: 'Create Product', description: 'Permission name' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'product', description: 'Resource name' })
  @IsString()
  resource!: string;

  @ApiProperty({ example: 'create', description: 'Action name (e.g. create, read, update, delete)' })
  @IsString()
  action!: string;
}
