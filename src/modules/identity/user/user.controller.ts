import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async create(
    @Body()
    createUserDto: {
      email: string;
      firstName: string;
      lastName: string;
      phone: string;
      passwordHash: string;
    },
  ): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
