import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Batch } from './entities/batch.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateBatchDTO } from './dto/create-batch.dto';
import { CreatedBatchResponse } from './interfaces/create-batch-response.interface';
import * as validation from '../../utils/validationFunctions.util';
import { UpdateBatchDTO } from './dto/update-batch.dto';
import { UpdatedBatchResponse } from './interfaces/updated-batch-response.interface';
import { GetBatchResponse } from './interfaces/get-batch-response.interface';
import { CreateBatchObservationDTO } from './dto/create-batch-observation.dto';
import { BatchObservation } from './entities/batch_observations.entity';
import { CreatedBatchObservationResponse } from './interfaces/create-batch-observation-response.interface';
import { UpdateBatchObservationDTO } from './dto/update-batch-observation.dto';
import { UpdatedBatchObservationResponse } from './interfaces/updated-batch-observation-response.interface';
import { SoftRemoveBatchObservationResponse } from './interfaces/soft-remove-batch-observation-response.interface';
import { SettlementProjectCategory } from '../settlement_project_categories/entities/settlement_project_categories.entity';
import { BatchHistory } from './entities/batch_history.entity';
import { EventBatchHistory } from './enum/event-batch-history.enum';
import { CreateBatchAssingmentDTO } from './dto/create-batch-assingment.dto';
import { User } from '../users/entities/user.entity';
import {
  MAX_TAGS_ASSIGN_TO_BATCH,
  MAX_USERS_ASSIGN_TO_BATCH,
} from '../../utils/validationConstants';
import { CreatedBatchAssingmentResponse } from './interfaces/create-batch-assingment-response.interface';
import { RemoveBatchAssingmentDTO } from './dto/remove-batch-assigment.dto';
import { RemoveAssingmentResponse } from './interfaces/remove-assingment-response.interface';
import { UpdateBatchMainStatusDTO } from './dto/update-batch-main-status.dto';
import { UpdateStatusBatchResponse } from './interfaces/update-status-batch.interface';
import { QueryBatcheDTO } from './dto/query-batche.dto';
import { UpdateBatchSpecificStatusDTO } from './dto/update-batch-specific-status.dto';
import { AddTagDTO } from './dto/add-tag.dto';
import { Tag } from '../tags/entitites/tag.entity';
import { RemoveTagDTO } from './dto/remove-tag.dto';

@Injectable()
export class BatchesService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Batch)
    private readonly batchRepository: Repository<Batch>,
    @InjectRepository(BatchObservation)
    private readonly batchObservationRepository: Repository<BatchObservation>,
    @InjectRepository(BatchHistory)
    private readonly batchHistoryRepository: Repository<BatchHistory>,
    @InjectRepository(SettlementProjectCategory)
    private readonly settlementProjectCategoryRepository: Repository<SettlementProjectCategory>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  public async create(
    createBatchDTO: CreateBatchDTO,
    user_id: string,
  ): Promise<CreatedBatchResponse> {
    if (validation.isSettlementProjectInvalid(createBatchDTO.title)) {
      throw new BadRequestException(
        'Projeto de assentamento deve ter ao menos 3 caracteres.',
      );
    }

    const existingBatch = await this.batchRepository.findOne({
      where: {
        title: createBatchDTO.title,
      },
      select: ['id'],
    });

    if (existingBatch !== null) {
      throw new BadRequestException(
        'Já existe um lote com esse nome. Escolha outro nome.',
      );
    }

    const existingSettlementProject =
      await this.settlementProjectCategoryRepository.findOne({
        where: {
          id: createBatchDTO.settlement_project_category_id,
        },
        select: ['id'],
      });

    if (!existingSettlementProject) {
      throw new BadRequestException(
        'Categoria de projeto de assentamento não existe!',
      );
    }

    const batch = this.batchRepository.create({
      ...createBatchDTO,
      user_id: user_id,
    });

    const savedBatch = await this.batchRepository.save(batch);

    const batchHistory = await this.batchHistoryRepository.create({
      acted_by_id: user_id,
      batch_id: savedBatch.id,
      event_type: EventBatchHistory.CADASTRO,
    });

    await this.batchHistoryRepository.save(batchHistory);

    return {
      id: savedBatch.id,
      title: savedBatch.title,
      physical_files_count: savedBatch.physical_files_count,
      digital_files_count: savedBatch.digital_files_count,
      priority: Boolean(savedBatch.priority),
    };
  }

  public async find(query: QueryBatcheDTO): Promise<Batch[]> {
    const batches = await this.batchRepository
      .createQueryBuilder('batch')
      .leftJoinAndSelect('batch.tags', 'tag')
      .select([
        'batch.id',
        'batch.title',
        'batch.main_status',
        'batch.specific_status',
        'batch.digital_files_count',
        'batch.physical_files_count',
        'batch.priority',
        'batch.shelf_number',
        'batch.user_id',
        'batch.settlement_project_category_id',
        'batch.created_at',
        'batch.updated_at',
        'tag.id',
        'tag.name',
      ])
      .where('batch.main_status = :main_status', {
        main_status: query?.main_status || undefined,
      })
      .andWhere('batch.title LIKE :title', { title: `%${query?.title || ''}%` })
      .getMany();

    return batches;
  }

  public async findOne(batch_id: string): Promise<GetBatchResponse> {
    // Primeira consulta: Dados do Batch
    const batch = await this.batchRepository
      .createQueryBuilder('batch')
      .innerJoinAndSelect('batch.user', 'user')
      .innerJoinAndSelect(
        'batch.settlement_project_category',
        'settlement_project_category',
      )
      .leftJoinAndSelect('batch.assignedUsers', 'assignedUsers')
      .leftJoinAndSelect('batch.tags', 'tags')
      .where('batch.id = :id', { id: batch_id })
      .getOne();

    if (!batch) {
      throw new NotFoundException('Projeto de assentamento não encontrado.');
    }

    const observationsData = await this.batchRepository
      .createQueryBuilder('batch')
      .leftJoinAndSelect('batch.batch_observations', 'batchObservations')
      .leftJoinAndSelect('batchObservations.user', 'observationUser')
      .where('batch.id = :id', { id: batch_id })
      .select([
        'batchObservations.id',
        'batchObservations.observation',
        'observationUser.id',
        'observationUser.name',
        'batchObservations.created_at',
      ])
      .getRawMany();

    // Mapeando somente se tiver dados válidos
    const observations = observationsData
      ?.filter((data) => data.batchObservations_id !== null)
      .map((data) => ({
        id: data.batchObservations_id,
        observation: data.batchObservations_observation,
        created_by: {
          user_id: data.observationUser_id,
          name: data.observationUser_name,
        },
        created_at: data.batchObservations_created_at,
      }));

    return {
      id: batch.id,
      title: batch.title,
      main_status: batch.main_status,
      specific_status: batch.specific_status,
      digital_files_count: batch.digital_files_count,
      physical_files_count: batch.physical_files_count,
      priority: batch.priority,
      shelf_number: batch.shelf_number,
      created_at: batch.created_at,
      updated_at: batch.updated_at,
      created_by: {
        user_id: batch.user?.id,
        name: batch.user?.name,
      },
      category: {
        settlement_project_category_id: batch.settlement_project_category?.id,
        name: batch.settlement_project_category?.name,
      },
      assigned_users: batch.assignedUsers?.map((user) => ({
        id: user.id,
        name: user.name,
      })),
      tags: batch.tags?.map((user) => ({
        id: user.id,
        name: user.name,
      })),
      observations,
    };
  }

  public async update(
    batch_id: string,
    updateBatchDTO: UpdateBatchDTO,
  ): Promise<UpdatedBatchResponse> {
    if (Object.keys(updateBatchDTO).length === 0 || updateBatchDTO === null) {
      throw new BadRequestException(
        'Para atualizar lote é necessário no mínimo preencher um campo.',
      );
    }

    const batch = await this.batchRepository.findOne({
      where: {
        id: batch_id,
      },
      select: ['id'],
    });

    if (!batch) {
      throw new NotFoundException('Projeto de assentamento não encontrado.');
    }

    if (
      updateBatchDTO.title !== null &&
      updateBatchDTO.title !== undefined &&
      validation.isSettlementProjectInvalid(updateBatchDTO.title)
    ) {
      throw new BadRequestException(
        'Projeto de assentamento deve ter ao menos 3 caracteres.',
      );
    }

    if (
      updateBatchDTO.physical_files_count !== null &&
      updateBatchDTO.physical_files_count !== undefined &&
      validation.isUpdateFilesCountValid(updateBatchDTO.physical_files_count)
    ) {
      throw new BadRequestException(
        'Número de documentos físicos deve ser maior ou igual a zero.',
      );
    }

    if (
      updateBatchDTO.digital_files_count !== null &&
      updateBatchDTO.digital_files_count !== undefined &&
      validation.isUpdateFilesCountValid(updateBatchDTO.digital_files_count)
    ) {
      throw new BadRequestException(
        'Número de documentos digitais deve ser maior ou igual a zero.',
      );
    }

    const filteredDTO = Object.fromEntries(
      Object.entries(updateBatchDTO).filter(
        ([, value]) => value !== null && value !== undefined,
      ),
    );

    Object.assign(batch, filteredDTO);

    const savedBatch = await this.batchRepository.save(batch);

    return {
      id: savedBatch.id,
      title: savedBatch.title,
      physical_files_count: savedBatch.physical_files_count,
      digital_files_count: savedBatch.digital_files_count,
      priority: Boolean(savedBatch.priority),
      updated_at: savedBatch.updated_at,
    };
  }

  public async updateMainStatus(
    batch_id: string,
    user_id: string,
    { main_status }: UpdateBatchMainStatusDTO,
  ): Promise<UpdateStatusBatchResponse> {
    if (validation.isMainStatusBatchInvalid(main_status)) {
      throw new BadRequestException(
        'Atualização de status principal inválida. Insira um status válido.',
      );
    }

    const batch = await this.batchRepository.findOne({
      where: { id: batch_id },
    });

    if (!batch) {
      throw new NotFoundException('Projeto de assentamento não encontrado.');
    }

    batch.main_status = main_status;

    await this.batchRepository.save(batch);

    const batchHistory = this.batchHistoryRepository.create({
      acted_by_id: user_id,
      batch_id: batch.id,
      event_type: EventBatchHistory.EDICAO_STATUS_PRINCIPAL,
    });

    await this.batchHistoryRepository.save(batchHistory);

    return {
      status: 'ok',
    };
  }

  public async updateSpecificStatus(
    batch_id: string,
    user_id: string,
    { specific_status }: UpdateBatchSpecificStatusDTO,
  ): Promise<UpdateStatusBatchResponse> {
    if (validation.isSpecificStatusBatchInvalid(specific_status)) {
      throw new BadRequestException(
        'Atualização de status específico inválida. Insira um status válido.',
      );
    }

    const batch = await this.batchRepository.findOne({
      where: { id: batch_id },
    });

    if (!batch) {
      throw new NotFoundException('Projeto de assentamento não encontrado.');
    }

    batch.specific_status = specific_status;

    await this.batchRepository.save(batch);

    const batchHistory = this.batchHistoryRepository.create({
      acted_by_id: user_id,
      batch_id: batch.id,
      event_type: EventBatchHistory.EDICAO_STATUS_ESPECIFICO,
    });

    await this.batchHistoryRepository.save(batchHistory);

    return {
      status: 'ok',
    };
  }

  public async addTag(
    batch_id: string,
    user_id: string,
    addTagDTO: AddTagDTO,
  ): Promise<any> {
    if (addTagDTO.tags.length === 0) {
      throw new BadRequestException(
        'Lista de tags para atrelar ao lote deve possuir ao menos um ID de tag.',
      );
    }

    if (validation.isTagsAssignmentCountInvalid(addTagDTO.tags)) {
      throw new BadRequestException(
        `Não é possível atrelar mais de ${MAX_TAGS_ASSIGN_TO_BATCH} tags ao lote.`,
      );
    }

    if (validation.isDuplicatedIds(addTagDTO.tags)) {
      throw new BadRequestException(
        'Não é possível atrelar tags repetidas ao lote.',
      );
    }

    const batch = await this.batchRepository.findOne({
      where: { id: batch_id },
      relations: ['tags'],
    });

    if (!batch) {
      throw new NotFoundException('Projeto de assentamento não encontrado.');
    }

    const tagsToAssign = await this.tagRepository.findBy({
      id: In(addTagDTO.tags),
    });

    const foundTagIds = tagsToAssign.map((tag) => tag.id);
    const missingTagIds = addTagDTO.tags.filter(
      (id) => !foundTagIds.includes(id),
    );

    if (missingTagIds.length > 0) {
      throw new NotFoundException(
        `Os seguintes IDs de tags não foram encontrados: ${missingTagIds.join(
          ', ',
        )}`,
      );
    }

    const alreadyAssignedTagIds = batch.tags.map((tag) => tag.id);

    if (validation.isTagsAssignmentCountInvalid(alreadyAssignedTagIds)) {
      throw new BadRequestException(
        `Lote já possui a quantidade máxima de ${MAX_USERS_ASSIGN_TO_BATCH} tags atreladas.`,
      );
    }

    if (
      validation.isAssignmentSumTagsCountInvalid(
        alreadyAssignedTagIds,
        addTagDTO.tags,
      )
    ) {
      throw new BadRequestException(
        `Não é possível atrelas mais de ${MAX_TAGS_ASSIGN_TO_BATCH} tags ao lote. Lote já possui ${alreadyAssignedTagIds.length} tags atribuidas e está sendo realizada uma tentativa de atribuir mais ${addTagDTO.tags.length} tags no lote.`,
      );
    }

    const reAssignedTagsIds = addTagDTO.tags.filter((id) =>
      alreadyAssignedTagIds.includes(id),
    );

    if (reAssignedTagsIds.length > 0) {
      throw new BadRequestException(
        `Os seguintes IDs de tags já foram atribuídos a este lote: ${reAssignedTagsIds.join(
          ', ',
        )}`,
      );
    }

    batch.tags = [...batch.tags, ...tagsToAssign];

    await this.batchRepository.save(batch);

    return {
      status: 'ok',
    };
  }

  public async removeTag(
    batch_id: string,
    user_id: string,
    removeTagDTO: RemoveTagDTO,
  ): Promise<any> {
    const batch = await this.batchRepository.findOne({
      where: { id: batch_id },
      relations: ['tags'],
    });

    if (!batch) {
      throw new NotFoundException('Projeto de assentamento não encontrado.');
    }

    if (batch.tags.length === 0) {
      throw new NotFoundException(
        'Projeto de assentamento não possui tags atribuidas para serem removidas.',
      );
    }

    const tag = await this.tagRepository.findOne({
      where: {
        id: removeTagDTO.tag_id,
      },
    });

    if (!tag) {
      throw new NotFoundException('Tag não encontrada.');
    }

    const foundTag = batch.tags.find((t) => t.id === tag.id);

    if (!foundTag) {
      throw new NotFoundException('Tag não está atrelada ao lote.');
    }

    batch.tags = batch.tags.filter((t) => t.id !== tag.id);

    await this.batchRepository.save(batch);

    return {
      status: 'ok',
    };
  }

  public async assignment(
    batch_id: string,
    user_id: string,
    createBatchAssingmentDTO: CreateBatchAssingmentDTO,
  ): Promise<CreatedBatchAssingmentResponse> {
    if (createBatchAssingmentDTO.assignment_users_ids.length === 0) {
      throw new BadRequestException(
        'Lista de usuários para atribuição de lote deve possuir ao menos um ID de usuário.',
      );
    }

    if (
      validation.isAssignmentUsersCountInvalid(
        createBatchAssingmentDTO.assignment_users_ids,
      )
    ) {
      throw new BadRequestException(
        `Não é possível atribuir mais de ${MAX_USERS_ASSIGN_TO_BATCH} usuários ao lote.`,
      );
    }

    if (
      validation.isDuplicatedIds(createBatchAssingmentDTO.assignment_users_ids)
    ) {
      throw new BadRequestException(
        'Não é possível atribuir usuários repetidos ao lote.',
      );
    }

    const batch = await this.batchRepository.findOne({
      where: { id: batch_id },
      relations: ['assignedUsers'],
    });

    if (!batch) {
      throw new NotFoundException('Projeto de assentamento não encontrado.');
    }

    const usersToAssign = await this.userRepository.findBy({
      id: In(createBatchAssingmentDTO.assignment_users_ids),
    });

    const foundUserIds = usersToAssign.map((user) => user.id);
    const missingUserIds = createBatchAssingmentDTO.assignment_users_ids.filter(
      (id) => !foundUserIds.includes(id),
    );

    if (missingUserIds.length > 0) {
      throw new NotFoundException(
        `Os seguintes IDs de usuário não foram encontrados: ${missingUserIds.join(
          ', ',
        )}`,
      );
    }

    const alreadyAssignedUserIds = batch.assignedUsers.map((user) => user.id);

    if (validation.isAssignmentUsersCountInvalid(alreadyAssignedUserIds)) {
      throw new BadRequestException(
        `Lote já possui a quantidade máxima ${MAX_USERS_ASSIGN_TO_BATCH} usuários atribuidos.`,
      );
    }

    if (
      validation.isAssignmentSumUsersCountInvalid(
        alreadyAssignedUserIds,
        createBatchAssingmentDTO.assignment_users_ids,
      )
    ) {
      throw new BadRequestException(
        `Não é possível atribuir mais de ${MAX_USERS_ASSIGN_TO_BATCH} usuários ao lote. Lote já possui ${alreadyAssignedUserIds.length} usuários atribuidos e está sendo realizada uma tentativa de atribuir mais ${createBatchAssingmentDTO.assignment_users_ids.length} usuários no lote.`,
      );
    }
    const reAssignedUserIds =
      createBatchAssingmentDTO.assignment_users_ids.filter((id) =>
        alreadyAssignedUserIds.includes(id),
      );

    if (reAssignedUserIds.length > 0) {
      throw new BadRequestException(
        `Os seguintes IDs de usuário já foram atribuídos a este lote: ${reAssignedUserIds.join(
          ', ',
        )}`,
      );
    }

    batch.assignedUsers = [...batch.assignedUsers, ...usersToAssign];

    const savedBatch = await this.batchRepository.save(batch);

    const batchHistory = this.batchHistoryRepository.create({
      acted_by_id: user_id,
      batch_id: savedBatch.id,
      event_type: EventBatchHistory.ATRIBUICAO,
      users: usersToAssign,
    });

    await this.batchHistoryRepository.save(batchHistory);

    return {
      id: savedBatch.id,
      title: savedBatch.title,
      physical_files_count: savedBatch.physical_files_count,
      digital_files_count: savedBatch.digital_files_count,
      priority: savedBatch.priority,
      assignedUsers: savedBatch.assignedUsers.map((user) => ({
        id: user.id,
        name: user.name,
      })),
    };
  }

  public async removeAssignment(
    batch_id: string,
    user_id: string,
    removeBatchAssingmentDTO: RemoveBatchAssingmentDTO,
  ): Promise<RemoveAssingmentResponse> {
    const batch = await this.batchRepository.findOne({
      where: { id: batch_id },
      relations: ['assignedUsers'],
    });

    if (!batch) {
      throw new NotFoundException('Projeto de assentamento não encontrado.');
    }

    if (batch.assignedUsers.length === 0) {
      throw new NotFoundException(
        'Projeto de assentamento não possui usuários atribuidos para serem removidos.',
      );
    }

    const user = await this.userRepository.findOne({
      where: {
        id: removeBatchAssingmentDTO.assignment_user_id,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const foundUser = batch.assignedUsers.find((u) => u.id === user.id);

    if (!foundUser) {
      throw new NotFoundException(
        'Usuário não está atribuído ao projeto de assentamento.',
      );
    }

    batch.assignedUsers = batch.assignedUsers.filter((au) => au.id !== user.id);

    await this.batchRepository.save(batch);

    const batchHistory = this.batchHistoryRepository.create({
      acted_by_id: user_id,
      batch_id: batch.id,
      event_type: EventBatchHistory.REMOCAO_ATRIBUICAO,
      users: [user],
    });

    await this.batchHistoryRepository.save(batchHistory);

    return {
      status: 'ok',
    };
  }

  public async createBatchObservation(
    batch_id: string,
    user_id: string,
    createBatchObservationDTO: CreateBatchObservationDTO,
  ): Promise<CreatedBatchObservationResponse> {
    // TODO: adicionar número máximo de caracteres
    if (
      validation.isBatchObservationValid(createBatchObservationDTO.observation)
    ) {
      throw new BadRequestException(
        'Observação deve ter ao menos 3 caracteres.',
      );
    }

    const batch = await this.batchRepository.findOne({
      where: {
        id: batch_id,
      },
    });

    if (!batch) {
      throw new NotFoundException('Projeto de assentamento não encontrado.');
    }

    const batchObservation = this.batchObservationRepository.create({
      ...createBatchObservationDTO,
      batch_id,
      user_id,
    });

    const savedBatchObservation = await this.batchObservationRepository.save(
      batchObservation,
    );

    return {
      id: savedBatchObservation.id,
      batch_id: savedBatchObservation.batch_id,
      observation: savedBatchObservation.observation,
    };
  }

  public async updateBatchObservation(
    batch_observation_id: string,
    user_id: string,
    updateBatchObservationDTO: UpdateBatchObservationDTO,
  ): Promise<UpdatedBatchObservationResponse> {
    const batchObservation = await this.batchObservationRepository.findOne({
      where: {
        id: batch_observation_id,
      },
      select: ['id', 'observation', 'user_id'],
    });

    if (!batchObservation) {
      throw new NotFoundException(
        'Observação de projeto de assentamento não encontrada.',
      );
    }

    if (batchObservation.user_id !== user_id) {
      throw new BadRequestException(
        'Edição de obsevação não autorizada. Usuário não criou observação.',
      );
    }

    if (
      validation.isBatchObservationValid(updateBatchObservationDTO.observation)
    ) {
      throw new BadRequestException(
        'Observação deve ter ao menos 3 caracteres.',
      );
    }

    const filteredDTO = Object.fromEntries(
      Object.entries(updateBatchObservationDTO).filter(
        ([, value]) => value !== null && value !== undefined,
      ),
    );

    Object.assign(batchObservation, filteredDTO);

    const savedBatchObservation = await this.batchObservationRepository.save(
      batchObservation,
    );

    return {
      id: savedBatchObservation.id,
      batch_id: savedBatchObservation.batch_id,
      observation: savedBatchObservation.observation,
    };
  }

  public async softDeleteBatchObservation(
    batch_observation_id: string,
  ): Promise<SoftRemoveBatchObservationResponse> {
    const batchObservation = await this.batchObservationRepository.findOne({
      where: {
        id: batch_observation_id,
      },
      select: ['id'],
    });

    if (!batchObservation) {
      throw new NotFoundException(
        'Observação de projeto de assentamento não encontrada.',
      );
    }

    const deletedBatchObservation =
      await this.batchObservationRepository.softRemove(batchObservation);

    return {
      id: deletedBatchObservation.id,
      deleted_at: deletedBatchObservation.deleted_at,
    };
  }
}
