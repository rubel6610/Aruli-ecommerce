import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'John', description: 'First name' })
  @IsString()
  firstName!: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  @IsString()
  lastName!: string;

  @ApiProperty({ example: '1234567890', description: 'Phone number' })
  @IsString()
  phone!: string;

  @ApiProperty({ example: 'password123', description: 'Password (min 6 characters)', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;
}
