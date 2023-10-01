import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as validation from '../../utils/validationFunctions.util';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDTO } from './dto/create-role.dto';
import { CreatedRoleResponse } from './interfaces/create-role-response.interface';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
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

    const role = this.roleRepository.create({
      ...createRoleDTO,
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
}