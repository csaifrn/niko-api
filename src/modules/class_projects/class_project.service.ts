import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassProject } from './entities/class_project';
import { Repository } from 'typeorm';
import { CreateClassProjectDTO } from './dto/create-class-project.dto';
import * as validation from '../../utils/validationFunctions.util';
import { CreatedClassProjectResponse } from './interfaces/created-class-project-response.interface';
import { AutocompleteResponse } from './interfaces/autocomplete-response.interface';
import { UpdateClassProjectDTO } from './dto/update-class-project.dto';
import { UpdatedClassProjectResponse } from './interfaces/updated-class-project-response.interface';
import { RemovedBatchResponse } from './interfaces/removed-batch-response.interface';

@Injectable()
export class ClassProjectService {
  @InjectRepository(ClassProject)
  private readonly classProjectRepository: Repository<ClassProject>;

  public async create(
    createClassProjectDTO: CreateClassProjectDTO,
    user_id: string,
  ): Promise<CreatedClassProjectResponse> {
    if (validation.isClassProjectNameInvalid(createClassProjectDTO.name)) {
      throw new BadRequestException('Classe deve ter ao menos 3 caracteres.');
    }

    const classProject = this.classProjectRepository.create({
      ...createClassProjectDTO,
      user_id,
    });

    const savedClassProject = await this.classProjectRepository.save(
      classProject,
    );

    return {
      id: savedClassProject.id,
      name: savedClassProject.name,
    };
  }

  public async update(
    batch_id: string,
    updateClassProjectDTO: UpdateClassProjectDTO,
  ): Promise<UpdatedClassProjectResponse> {
    const batch = await this.classProjectRepository.findOne({
      where: {
        id: batch_id,
      },
    });

    if (!batch) {
      throw new NotFoundException('Classe não encontrada.');
    }
    if (
      updateClassProjectDTO?.name &&
      validation.isClassProjectNameInvalid(updateClassProjectDTO.name)
    ) {
      throw new BadRequestException('Classe deve ter ao menos 3 caracteres.');
    }

    if (updateClassProjectDTO?.name) {
      const existingClassProject = await this.classProjectRepository.findOne({
        where: {
          name: updateClassProjectDTO.name,
        },
      });

      if (existingClassProject) {
        throw new BadRequestException(
          'Já existe uma classe com esse nome. Escolha outro nome.',
        );
      }
    }

    batch.name = updateClassProjectDTO.name;
    batch.priority =
      updateClassProjectDTO?.priority !== undefined
        ? updateClassProjectDTO?.priority
        : batch.priority;

    const savedClassProject = await this.classProjectRepository.save(batch);

    return {
      id: savedClassProject.id,
      name: savedClassProject.name,
      priority: savedClassProject.priority,
    };
  }

  public async find(): Promise<any[]> {
    const classProjects = await this.classProjectRepository
      .createQueryBuilder('spc')
      .leftJoin('spc.batches', 'batch')
      .select('spc.id', 'id')
      .addSelect('spc.name', 'name')
      .addSelect('spc.priority', 'priority')
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

    const result = classProjects.map((category) => ({
      id: category.id,
      name: category.name,
      priority: Boolean(category.priority),
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
    const class_project_categories = await this.classProjectRepository
      .createQueryBuilder('class_project')
      .where('class_project.name LIKE :name', {
        name: `%${name.toLowerCase()}%`,
      })
      .select(['class_project.id as id ', 'class_project.name as name'])
      .getRawMany();

    return {
      searchedText: name,
      classes: class_project_categories,
    };
  }

  public async remove(class_project_id: string): Promise<RemovedBatchResponse> {
    const classProject = await this.classProjectRepository.findOne({
      where: {
        id: class_project_id,
      },
    });

    if (!classProject) {
      throw new NotFoundException('Classe não encontrada.');
    }

    await this.classProjectRepository.softRemove(classProject);

    return {
      status: 'ok',
    };
  }
}
