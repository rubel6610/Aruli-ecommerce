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
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateAddressDto } from './dto/create-address.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created.' })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Get all active users' })
  @ApiResponse({ status: 200, description: 'List of all users.' })
  @Get()
  async findAllUser() {
    return this.userService.findAllUser();
  }

  @ApiOperation({ summary: 'Get user details by ID' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'User details retrieved.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @ApiOperation({ summary: 'Update user details' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(id, dto);
  }

  @ApiOperation({ summary: 'Soft delete a user account' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'User account soft deleted.' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userService.softDeleteUser(id);
  }

  // --- Addresses ---

  @ApiOperation({ summary: 'Add a new shipping address for user' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({ status: 201, description: 'Address added successfully.' })
  @Post(':id/addresses')
  async addAddress(@Param('id') userId: string, @Body() dto: CreateAddressDto) {
    return this.userService.addAddress(userId, dto);
  }

  @ApiOperation({ summary: 'Get all addresses for a user' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'List of user addresses.' })
  @Get(':id/addresses')
  async getAddresses(@Param('id') userId: string) {
    return this.userService.getUserAddresses(userId);
  }

  @ApiOperation({ summary: 'Set address as default address' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiParam({ name: 'addressId', description: 'Address UUID' })
  @ApiResponse({ status: 200, description: 'Address set as default.' })
  @HttpCode(HttpStatus.OK)
  @Patch(':id/addresses/:addressId/default')
  async setDefaultAddress(
    @Param('id') userId: string,
    @Param('addressId') addressId: string,
  ) {
    return this.userService.setDefaultAddress(userId, addressId);
  }

  @ApiOperation({ summary: 'Delete a user address' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiParam({ name: 'addressId', description: 'Address UUID' })
  @ApiResponse({ status: 200, description: 'Address deleted.' })
  @Delete(':id/addresses/:addressId')
  async deleteAddress(
    @Param('id') userId: string,
    @Param('addressId') addressId: string,
  ) {
    return this.userService.deleteAddress(userId, addressId);
  }
}
