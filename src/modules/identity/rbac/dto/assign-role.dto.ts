import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AssignRoleDto {
  @ApiProperty({ example: 'user-uuid-here', description: 'User UUID' })
  @IsUUID()
  userId!: string;

  @ApiProperty({ example: 'role-uuid-here', description: 'Role UUID' })
  @IsUUID()
  roleId!: string;

  @ApiProperty({ example: 'admin-uuid-here', description: 'ID of staff assigning the role' })
  @IsUUID()
  assignedById!: string;
}
