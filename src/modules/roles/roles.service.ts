import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as validation from '../../utils/validationFunctions.util';
import { Role } from './entities/role.entity';
import { In, Repository } from 'typeorm';
import { CreateRoleDTO } from './dto/create-role.dto';
import { CreatedRoleResponse } from './interfaces/create-role-response.interface';
import { Permission } from '../permissions/entities/permission.entity';
import { FindRolePermissionsAuthResponse } from './interfaces/find-role-permissions-auth.interface';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  public async create(
    createRoleDTO: CreateRoleDTO,
    user_id: string,
  ): Promise<CreatedRoleResponse> {
    if (validation.isRoleNameInvalid(createRoleDTO.name)) {
      throw new BadRequestException('Função deve ter ao menos 3 caracteres.');
    }

    if (validation.isRoleDescriptionInvalid(createRoleDTO.description)) {
      throw new BadRequestException(
        'Descrição da função deve ter ao menos 5 caracteres.',
      );
    }

    const existingRole = await this.roleRepository.findOne({
      where: {
        name: createRoleDTO.name,
      },
      select: ['id'],
    });

    if (existingRole !== null) {
      throw new BadRequestException(
        'Já existe uma função com esse nome. Escolha outro nome.',
      );
    }

    const permissions = await this.permissionRepository.findBy({
      id: In(createRoleDTO.permissions),
    });

    const role = this.roleRepository.create({
      ...createRoleDTO,
      permissions,
      user_id,
    });

    const savedRole = await this.roleRepository.save(role);

    return {
      id: savedRole.id,
      name: savedRole.name,
      description: savedRole.description,
      created_at: savedRole.created_at,
    };
  }

  public async findRolePermissionsForAuth(
    role_name: string,
  ): Promise<FindRolePermissionsAuthResponse> {
    const role_permissions = await this.roleRepository
      .createQueryBuilder('role')
      .innerJoin('permissions_roles', 'pr', 'pr.role_id = role.id')
      .innerJoin('permissions', 'p', 'p.id = pr.permission_id')
      .where('role.name = :name', { name: role_name })
      .select(['p.id as permission_id', 'p.name as permission_name'])
      .getRawMany();

    if (!role_permissions) {
      throw new BadRequestException('Função não encontrada.');
    }

    return {
      name: role_name,
      permissions: role_permissions,
    };
  }
}
