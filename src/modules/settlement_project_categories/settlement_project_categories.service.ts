import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SettlementProjectCategory } from './entities/settlement_project_categories.entity';
import { Repository } from 'typeorm';
import { CreateSettlementProjectCategoryDTO } from './dto/create-settlement-project-category.dto';
import * as validation from '../../utils/validationFunctions.util';
import { CreatedSettlementProjectCategoryResponse } from './interfaces/created-settlement-project-category-response.interface';

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
}
