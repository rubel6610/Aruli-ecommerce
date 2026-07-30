import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RbacService } from './rbac.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { AssignRoleDto } from './dto/assign-role.dto';

@ApiTags('RBAC (Role-Based Access Control)')
@Controller('rbac')
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Role created successfully.' })
  @Post('roles')
  async createRole(@Body() dto: CreateRoleDto) {
    return this.rbacService.createRole(dto);
  }

  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: 200, description: 'List of all roles.' })
  @Get('roles')
  async findAllRoles() {
    return this.rbacService.findAllRoles();
  }

  @ApiOperation({ summary: 'Get role details by ID' })
  @ApiParam({ name: 'id', description: 'Role UUID' })
  @ApiResponse({ status: 200, description: 'Role details.' })
  @Get('roles/:id')
  async findRoleById(@Param('id') id: string) {
    return this.rbacService.findRoleById(id);
  }

  @ApiOperation({ summary: 'Create a new permission' })
  @ApiResponse({ status: 201, description: 'Permission created successfully.' })
  @Post('permissions')
  async createPermission(@Body() dto: CreatePermissionDto) {
    return this.rbacService.createPermission(dto);
  }

  @ApiOperation({ summary: 'Get all permissions' })
  @ApiResponse({ status: 200, description: 'List of all permissions.' })
  @Get('permissions')
  async findAllPermissions() {
    return this.rbacService.findAllPermissions();
  }

  @ApiOperation({ summary: 'Assign a role to a user' })
  @ApiResponse({ status: 201, description: 'Role assigned to user.' })
  @Post('user-roles')
  async assignRole(@Body() dto: AssignRoleDto) {
    return this.rbacService.assignRoleToUser(dto);
  }

  @ApiOperation({ summary: 'Remove a role from a user' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiParam({ name: 'roleId', description: 'Role UUID' })
  @ApiResponse({ status: 200, description: 'Role removed from user.' })
  @Delete('user-roles/:userId/:roleId')
  async removeRole(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
  ) {
    return this.rbacService.removeRoleFromUser(userId, roleId);
  }

  @ApiOperation({ summary: 'Get all active permissions for a user' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'List of user permissions.' })
  @Get('user-permissions/:userId')
  async getUserPermissions(@Param('userId') userId: string) {
    return this.rbacService.getUserPermissions(userId);
  }
}
