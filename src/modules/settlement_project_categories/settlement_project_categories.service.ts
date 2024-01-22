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
import { RemovedBatchResponse } from './interfaces/removed-batch-response.interface';

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

  public async find(): Promise<any[]> {
    const settlementProjectCategories =
      await this.settlementProjectCategoryRepository
        .createQueryBuilder('spc')
        .leftJoin('spc.batches', 'batch')
        .select('spc.id', 'id')
        .addSelect('spc.name', 'name')
        .addSelect('spc.user_id', 'user_id')
        .addSelect('spc.created_at', 'created_at')
        .addSelect('spc.updated_at', 'updated_at')
        .addSelect('COUNT(batch.id)', 'batch_count')
        .addSelect(
          'SUM(CASE WHEN batch.main_status = 0 THEN 1 ELSE 0 END)',
          'preparation_batch_count',
        )
        .addSelect(
          'SUM(CASE WHEN batch.main_status = 1 THEN 1 ELSE 0 END)',
          'cataloguing_batch_count',
        )
        .addSelect(
          'SUM(CASE WHEN batch.main_status = 2 THEN 1 ELSE 0 END)',
          'digitization_scanning_batch_count',
        )
        .addSelect(
          'SUM(CASE WHEN batch.main_status = 3 THEN 1 ELSE 0 END)',
          'upload_batch_count',
        )
        .addSelect(
          'SUM(CASE WHEN batch.main_status = 4 THEN 1 ELSE 0 END)',
          'archiving_batch_count',
        )
        .addSelect(
          'SUM(CASE WHEN batch.main_status = 0 AND batch.specific_status = 0 THEN 1 ELSE 0 END)',
          'preparation_specific_status_0_count',
        )
        .addSelect(
          'SUM(CASE WHEN batch.main_status = 0 AND batch.specific_status = 1 THEN 1 ELSE 0 END)',
          'preparation_specific_status_1_count',
        )
        .addSelect(
          'SUM(CASE WHEN batch.main_status = 0 AND batch.specific_status = 2 THEN 1 ELSE 0 END)',
          'preparation_specific_status_2_count',
        )
        .addSelect(
          'SUM(CASE WHEN batch.main_status = 1 AND batch.specific_status = 0 THEN 1 ELSE 0 END)',
          'cataloguing_specific_status_0_count',
        )
        .addSelect(
          'SUM(CASE WHEN batch.main_status = 1 AND batch.specific_status = 1 THEN 1 ELSE 0 END)',
          'cataloguing_specific_status_1_count',
        )
        .addSelect(
          'SUM(CASE WHEN batch.main_status = 1 AND batch.specific_status = 2 THEN 1 ELSE 0 END)',
          'cataloguing_specific_status_2_count',
        )
        .addSelect(
          'SUM(CASE WHEN batch.main_status = 2 AND batch.specific_status = 0 THEN 1 ELSE 0 END)',
          'digitization_scanning_specific_status_0_count',
        )
        .addSelect(
          'SUM(CASE WHEN batch.main_status = 2 AND batch.specific_status = 1 THEN 1 ELSE 0 END)',
          'digitization_scanning_specific_status_1_count',
        )
        .addSelect(
          'SUM(CASE WHEN batch.main_status = 2 AND batch.specific_status = 2 THEN 1 ELSE 0 END)',
          'digitization_scanning_specific_status_2_count',
        )
        .addSelect(
          'SUM(CASE WHEN batch.main_status = 3 AND batch.specific_status = 0 THEN 1 ELSE 0 END)',
          'upload_specific_status_0_count',
        )
        .addSelect(
          'SUM(CASE WHEN batch.main_status = 3 AND batch.specific_status = 1 THEN 1 ELSE 0 END)',
          'upload_specific_status_1_count',
        )
        .addSelect(
          'SUM(CASE WHEN batch.main_status = 3 AND batch.specific_status = 2 THEN 1 ELSE 0 END)',
          'upload_specific_status_2_count',
        )
        .addSelect(
          'SUM(CASE WHEN batch.main_status = 4 AND batch.specific_status = 0 THEN 1 ELSE 0 END)',
          'archiving_specific_status_0_count',
        )
        .addSelect(
          'SUM(CASE WHEN batch.main_status = 4 AND batch.specific_status = 1 THEN 1 ELSE 0 END)',
          'archiving_specific_status_1_count',
        )
        .addSelect(
          'SUM(CASE WHEN batch.main_status = 4 AND batch.specific_status = 2 THEN 1 ELSE 0 END)',
          'archiving_specific_status_2_count',
        )
        .groupBy('spc.id')
        .getRawMany();

    const result = settlementProjectCategories.map((category) => ({
      id: category.id,
      name: category.name,
      user_id: category.user_id,
      created_at: category.created_at,
      updated_at: category.updated_at,
      batch_count: category.batch_count,
      preparation_batch_count: category.preparation_batch_count,
      preparation_available: category.preparation_specific_status_0_count,
      preparation_in_progress: category.preparation_specific_status_1_count,
      preparation_done: category.preparation_specific_status_2_count,
      cataloguing_batch_count: category.cataloguing_batch_count,
      cataloguing_available: category.cataloguing_specific_status_0_count,
      cataloguing_in_progress: category.cataloguing_specific_status_1_count,
      cataloguing_done: category.cataloguing_specific_status_2_count,
      digitization_scanning_batch_count:
        category.digitization_scanning_batch_count,
      digitization_scanning_available:
        category.digitization_scanning_specific_status_0_count,
      digitization_scanning_in_progress:
        category.digitization_scanning_specific_status_1_count,
      digitization_scanning_done:
        category.digitization_scanning_specific_status_2_count,
      upload_batch_count: category.upload_batch_count,
      upload_available: category.upload_specific_status_0_count,
      upload_in_progress: category.upload_specific_status_1_count,
      upload_done: category.upload_specific_status_2_count,
      archiving_batch_count: category.archiving_batch_count,
      archiving_available: category.archiving_specific_status_0_count,
      archiving_in_progress: category.archiving_specific_status_1_count,
      archiving_done: category.archiving_specific_status_2_count,
    }));

    return result;
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

  public async remove(
    settlement_project_category_id: string,
  ): Promise<RemovedBatchResponse> {
    const batch = await this.settlementProjectCategoryRepository.findOne({
      where: {
        id: settlement_project_category_id,
      },
    });

    if (!batch) {
      throw new NotFoundException(
        'Categoria de projeto de assentamento não encontrada.',
      );
    }

    await this.settlementProjectCategoryRepository.softRemove(batch);

    return {
      status: 'ok',
    };
  }
}
