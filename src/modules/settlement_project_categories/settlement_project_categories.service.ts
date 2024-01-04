import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SettlementProjectCategory } from './entities/settlement_project_categories.entity';
import { Repository } from 'typeorm';
import { CreateSettlementProjectCategoryDTO } from './dto/create-settlement-project-category.dto';
import * as validation from '../../utils/validationFunctions.util';
import { CreatedSettlementProjectCategoryResponse } from './interfaces/created-settlement-project-category-response.interface';
import { AutocompleteResponse } from './interfaces/autocomplete-response.interface';
import { UpdateSettlementProjectCategoryDTO } from './dto/update-settlement-project-category.dto';
import { UpdatedSettlementProjectCategoryResponse } from './interfaces/updated-settlement-project-category-response.interface';

@Injectable()
export class SettlementProjectCategoriesService {
  @InjectRepository(SettlementProjectCategory)
  private readonly settlementProjectCategoryRepository: Repository<SettlementProjectCategory>;

  public async create(
    createSettlementProjectCategoryDTO: CreateSettlementProjectCategoryDTO,
    user_id: string,
  ): Promise<CreatedSettlementProjectCategoryResponse> {
    if (
      validation.isSettlementProjectNameInvalid(
        createSettlementProjectCategoryDTO.name,
      )
    ) {
      throw new BadRequestException(
        'Projeto de assentamento deve ter ao menos 3 caracteres.',
      );
    }

    const existingSettlementProject =
      await this.settlementProjectCategoryRepository.findOne({
        where: {
          name: createSettlementProjectCategoryDTO.name,
        },
        select: ['id'],
      });

    if (existingSettlementProject) {
      throw new BadRequestException(
        'Já existe uma categoria de projeto de assentamento com esse nome. Escolha outro nome.',
      );
    }

    const settlementProjectCategory =
      this.settlementProjectCategoryRepository.create({
        ...createSettlementProjectCategoryDTO,
        user_id,
      });

    const savedSettlementProjectCategory =
      await this.settlementProjectCategoryRepository.save(
        settlementProjectCategory,
      );

    return {
      id: savedSettlementProjectCategory.id,
      name: savedSettlementProjectCategory.name,
    };
  }

  public async update(
    batch_id: string,
    updateSettlementProjectCategoryDTO: UpdateSettlementProjectCategoryDTO,
  ): Promise<UpdatedSettlementProjectCategoryResponse> {
    const batch = await this.settlementProjectCategoryRepository.findOne({
      where: {
        id: batch_id,
      },
    });

    if (!batch) {
      throw new NotFoundException(
        'Categoria de projeto de assentamento não encontrada.',
      );
    }
    if (
      validation.isSettlementProjectNameInvalid(
        updateSettlementProjectCategoryDTO.name,
      )
    ) {
      throw new BadRequestException(
        'Projeto de assentamento deve ter ao menos 3 caracteres.',
      );
    }

    const existingSettlementProject =
      await this.settlementProjectCategoryRepository.findOne({
        where: {
          name: updateSettlementProjectCategoryDTO.name,
        },
      });

    if (existingSettlementProject) {
      throw new BadRequestException(
        'Já existe uma categoria de projeto de assentamento com esse nome. Escolha outro nome.',
      );
    }

    batch.name = updateSettlementProjectCategoryDTO.name;

    const savedSettlementProjectCategory =
      await this.settlementProjectCategoryRepository.save(batch);

    return {
      id: savedSettlementProjectCategory.id,
      name: savedSettlementProjectCategory.name,
    };
  }

  public async find(): Promise<SettlementProjectCategory[]> {
    const settlementProjectCategories =
      await this.settlementProjectCategoryRepository.find();

    return settlementProjectCategories;
  }

  public async autocomplete(name: string): Promise<AutocompleteResponse> {
    const settlement_project_categories =
      await this.settlementProjectCategoryRepository
        .createQueryBuilder('settlement_project')
        .where('settlement_project.name LIKE :name', {
          name: `%${name.toLowerCase()}%`,
        })
        .select([
          'settlement_project.id as id ',
          'settlement_project.name as name',
        ])
        .getRawMany();

    return {
      searchedText: name,
      categories: settlement_project_categories,
    };
  }
}
