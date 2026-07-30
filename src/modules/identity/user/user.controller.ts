import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  NotFoundException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateAddressDto } from './dto/create-address.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAllUser(){
    return this.userService.findAllUser()
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userService.softDeleteUser(id);
  }

  // --- Addresses ---

  @Post(':id/addresses')
  async addAddress(@Param('id') userId: string, @Body() dto: CreateAddressDto) {
    return this.userService.addAddress(userId, dto);
  }

  @Get(':id/addresses')
  async getAddresses(@Param('id') userId: string) {
    return this.userService.getUserAddresses(userId);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id/addresses/:addressId/default')
  async setDefaultAddress(
    @Param('id') userId: string,
    @Param('addressId') addressId: string,
  ) {
    return this.userService.setDefaultAddress(userId, addressId);
  }

  @Delete(':id/addresses/:addressId')
  async deleteAddress(
    @Param('id') userId: string,
    @Param('addressId') addressId: string,
  ) {
    return this.userService.deleteAddress(userId, addressId);
  }
}
