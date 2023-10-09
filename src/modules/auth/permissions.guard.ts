import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly roleService: RolesService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userRole: string = request.user.role;

    const userPermissionsObject =
      await this.roleService.findRolePermissionsForAuth(userRole);
    const userPermissionNames = userPermissionsObject.permissions.map(
      (perm) => perm.permission_name,
    );
    return requiredPermissions.every((permission) =>
      userPermissionNames.includes(permission),
    );
  }
}
