import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiPropertyOptional({ example: 'Chrome / Windows', description: 'Device or browser name' })
  @IsString()
  @IsOptional()
  deviceName?: string;
}
