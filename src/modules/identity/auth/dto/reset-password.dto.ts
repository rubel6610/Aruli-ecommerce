import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ description: 'Password reset token sent to email' })
  @IsString()
  token!: string;

  @ApiProperty({ example: 'newPassword123', description: 'New password (min 6 chars)', minLength: 6 })
  @IsString()
  @MinLength(6)
  newPassword!: string;
}
