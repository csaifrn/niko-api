import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';
import * as validation from '../../utils/validationFunctions.util';
import { CreatePermissionDTO } from './dto/create-permission.dto';
import { CreatedPermissionResponse } from './interfaces/create-permission-response.interface';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  public async create(
    createPermissionDTO: CreatePermissionDTO,
    user_id: string,
  ): Promise<CreatedPermissionResponse> {
    if (validation.isPermissionNameInvalid(createPermissionDTO.name)) {
      throw new BadRequestException(
        'Permissão deve ter ao menos 3 caracteres.',
      );
    }

    if (
      validation.isPermissionDescriptionInvalid(createPermissionDTO.description)
    ) {
      throw new BadRequestException(
        'Descrição da permissão deve ter ao menos 10 caracteres.',
      );
    }

    const existingPermission = await this.permissionRepository.findOne({
      where: {
        name: createPermissionDTO.name,
      },
      select: ['id'],
    });

    if (existingPermission !== null) {
      throw new BadRequestException(
        'Já existe uma permissão com esse nome. Escolha outro nome.',
      );
    }

    const permission = this.permissionRepository.create({
      ...createPermissionDTO,
      user_id,
    });

    const savedPermission = await this.permissionRepository.save(permission);

    return {
      id: savedPermission.id,
      name: savedPermission.name,
      description: savedPermission.description,
      created_at: savedPermission.created_at,
    };
  }
}
