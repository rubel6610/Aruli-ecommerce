export class CreateRoleDto {
  name!: string;
  isSystem?: boolean;
  permissionIds?: string[];
}
