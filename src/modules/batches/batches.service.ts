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
import { ClassProject } from '../class_projects/entities/class_project';
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
import { UpdateBatchObservationPendingResponse } from './interfaces/update-batch-observation-pending.interface';
import { AddClassProjectDTO } from './dto/add-class-project.dto';
import { RemoveClassProjectsDTO } from './dto/remove-class-project.dto';
import { MainStatusBatch } from './enum/main-status-batch.enum';
import { generateRandomCode } from '../../utils/generateRandomCode.util';
import { QueryBatchesStatusDTO } from './dto/query-batches-status.dto';
import { ListBatchesStatusResponse } from './interfaces/list-batches-status-response.interface';
import { SpecificStatusBatch } from './enum/specific-status-batch.enum';

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
    @InjectRepository(ClassProject)
    private readonly classProjectRepository: Repository<ClassProject>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  public async create(
    createBatchDTO: CreateBatchDTO,
    user_id: string,
  ): Promise<CreatedBatchResponse> {
    if (validation.isClassProjectInvalid(createBatchDTO.title)) {
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
      main_status: savedBatch.main_status,
      specific_status: savedBatch.specific_status,
      physical_files_count: savedBatch.physical_files_count,
      digital_files_count: savedBatch.digital_files_count,
      priority: Boolean(savedBatch.priority),
    };
  }

  public async find(query: QueryBatcheDTO): Promise<Batch[]> {
    const batches = await this.batchRepository
      .createQueryBuilder('batch')
      .leftJoinAndSelect('batch.class_projects', 'class_projects')
      .leftJoinAndSelect('batch.tags', 'tag')
      .leftJoinAndSelect('batch.assignedUsers', 'assignedUsers')
      .leftJoinAndSelect('assignedUsers.photo', 'photo')
      .leftJoinAndSelect('batch.batch_observations', 'observations')
      .loadRelationCountAndMap(
        'batch.batch_observations',
        'batch.batch_observations',
      )
      .loadRelationCountAndMap(
        'batch.pending_batch_observations',
        'batch.batch_observations',
        'pending_batch_observations', // alias for the relation in the subquery
        (qb) =>
          qb.andWhere('pending_batch_observations.is_pending = :isPending', {
            isPending: 1,
          }),
      )
      .select([
        'batch.id',
        'batch.title',
        'batch.main_status',
        'batch.specific_status',
        'batch.digital_files_count',
        'batch.physical_files_count',
        'batch.priority',
        'batch.storage_location',
        'batch.shelf_number',
        'batch.user_id',
        'batch.created_at',
        'batch.updated_at',
        'batch.deleted_at',
        'assignedUsers.id',
        'assignedUsers.name',
        'photo.url',
        'class_projects.id',
        'class_projects.name',
        'tag.id',
        'tag.name',
      ])
      .where('batch.main_status = :main_status', {
        main_status: query?.main_status || undefined,
      })
      .orderBy('batch.updated_at', 'DESC')
      .getMany();

    return batches;
  }

  public async listBatchesStatus({
    start_date,
    end_date,
  }: QueryBatchesStatusDTO): Promise<ListBatchesStatusResponse> {
    if (!(start_date instanceof Date)) {
      start_date = new Date(start_date);
    }
    if (!(end_date instanceof Date)) {
      end_date = new Date(end_date);
    }

    end_date.setDate(end_date.getDate() + 2);
    end_date.setHours(0, 0, 0, 0);

    const batches = await this.batchRepository
      .createQueryBuilder('batch')
      .where('batch.created_at BETWEEN :start_date AND :end_date', {
        start_date: start_date.toISOString(),
        end_date: end_date.toISOString(),
      })
      .select([
        'batch.main_status',
        'batch.specific_status',
        'batch.created_at',
        'batch.updated_at',
      ])
      .getRawMany();

    return {
      batches_count: batches.length,
      batches,
    };
  }

  public async findOne(batch_id: string): Promise<GetBatchResponse> {
    // Primeira consulta: Dados do Batch
    const batch = await this.batchRepository
      .createQueryBuilder('batch')
      .innerJoinAndSelect('batch.user', 'user')
      .leftJoinAndSelect('user.photo', 'photo')
      .leftJoinAndSelect('batch.assignedUsers', 'assignedUsers')
      .leftJoinAndSelect('batch.class_projects', 'class_projects')
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
        'batchObservations.is_pending',
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
        is_pending: Boolean(data.batchObservations_is_pending),
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
      storage_location: batch?.storage_location,
      created_at: batch.created_at,
      updated_at: batch.updated_at,
      created_by: {
        user_id: batch.user?.id,
        name: batch.user?.name,
        photo: batch.user.photo.url,
      },
      class_projects: batch.class_projects?.map((user) => ({
        id: user.id,
        name: user.name,
      })),
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

  // TODO validar se pode editar lote de acordo com sua fase
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
    });

    if (!batch) {
      throw new NotFoundException('Lote não encontrado.');
    }

    if (
      updateBatchDTO.title !== null &&
      updateBatchDTO.title !== undefined &&
      validation.isClassProjectInvalid(updateBatchDTO.title)
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
      relations: ['class_projects', 'assignedUsers'],
    });

    if (!batch) {
      throw new NotFoundException('Lote não encontrado.');
    }

    if (
      main_status >= MainStatusBatch.DIGITALIZACAO_ESCANEAMENTO &&
      batch.physical_files_count < 1
    ) {
      throw new NotFoundException(
        'Adicione arquivos físicos para avançar para a fase de digitalização e escaneamento.',
      );
    }

    if (
      main_status >= MainStatusBatch.UPLOAD &&
      batch.digital_files_count < 1
    ) {
      throw new NotFoundException(
        'Adicione arquivos digitais para avançar para a fase de upload.',
      );
    }

    if (main_status >= 2 && batch.class_projects.length === 0) {
      throw new NotFoundException(
        'Adicione as categorias de projeto de assentamento ao lote para avançar para as próximas fases.',
      );
    }

    batch.main_status = main_status;
    batch.specific_status = 0;
    batch.assignedUsers = [];

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
      throw new NotFoundException('Lote não encontrado.');
    }

    if (
      specific_status === SpecificStatusBatch.CONCLUIDO &&
      batch.main_status === MainStatusBatch.ARQUIVAMENTO &&
      !batch.storage_location
    ) {
      throw new NotFoundException(
        'Inclua a estante para concluir o arquivamento.',
      );
    }

    if (
      batch.main_status === MainStatusBatch.ARQUIVAMENTO &&
      batch.specific_status === SpecificStatusBatch.CONCLUIDO
    ) {
      batch.assignedUsers = [];
    }

    batch.specific_status = specific_status;

    await this.batchRepository.save(batch);

    if (
      batch.main_status === MainStatusBatch.ARQUIVAMENTO &&
      batch.specific_status === SpecificStatusBatch.CONCLUIDO
    ) {
      await this.generateShelfNumber(batch.id, user_id);
    }

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
      throw new NotFoundException('Lote não encontrado.');
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
      throw new NotFoundException('Lote não encontrado.');
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

  private async isShelfNumberUnique(shelfNumber: string): Promise<boolean> {
    const existing = await this.batchRepository.findOne({
      where: { shelf_number: shelfNumber },
    });
    return !existing;
  }

  public async generateShelfNumber(
    batch_id: string,
    user_id: string,
  ): Promise<any> {
    const batch = await this.batchRepository.findOne({
      where: { id: batch_id },
    });

    if (!batch) {
      throw new NotFoundException('Lote não encontrado.');
    }

    if (batch.shelf_number) {
      throw new NotFoundException('Lote já possui um código identificador.');
    }

    let uniqueShelfNumber = '';
    let isUnique = false;
    do {
      uniqueShelfNumber = generateRandomCode(6);
      isUnique = await this.isShelfNumberUnique(uniqueShelfNumber);
    } while (!isUnique);

    batch.shelf_number = uniqueShelfNumber;
    await this.batchRepository.save(batch);

    return {
      status: 'ok',
      shelfNumber: uniqueShelfNumber,
    };
  }

  public async addClassProject(
    batch_id: string,
    user_id: string,
    addClassProjectDTO: AddClassProjectDTO,
  ): Promise<any> {
    if (addClassProjectDTO.class_projects_ids.length === 0) {
      throw new BadRequestException(
        'Lista de categorias de projetos de assentamento para atrelar ao lote deve possuir ao menos um ID de projetos de assentament.',
      );
    }

    if (validation.isDuplicatedIds(addClassProjectDTO.class_projects_ids)) {
      throw new BadRequestException(
        'Não é possível atrelar classes repetidas ao lote.',
      );
    }

    const batch = await this.batchRepository.findOne({
      where: { id: batch_id },
      relations: ['class_projects'],
    });

    if (!batch) {
      throw new NotFoundException('Lote não encontrado.');
    }

    const classProjectsToAssign = await this.classProjectRepository.findBy({
      id: In(addClassProjectDTO.class_projects_ids),
    });

    const foundclassProjectsIds = classProjectsToAssign.map((spc) => spc.id);

    const missingclassProjectsIds =
      addClassProjectDTO.class_projects_ids.filter(
        (id) => !foundclassProjectsIds.includes(id),
      );

    if (missingclassProjectsIds.length > 0) {
      throw new NotFoundException(
        `Os seguintes IDs de classes não foram encontrados: ${missingclassProjectsIds.join(
          ', ',
        )}`,
      );
    }

    const alreadyAssignedClassProjectsIds = batch.class_projects.map(
      (spc) => spc.id,
    );

    const reAssignedAssignedClassProjectsIds =
      addClassProjectDTO.class_projects_ids.filter((id) =>
        alreadyAssignedClassProjectsIds.includes(id),
      );

    if (reAssignedAssignedClassProjectsIds.length > 0) {
      throw new BadRequestException(
        `Os seguintes IDs de categorias de projetos de assentamento já foram atribuídos a este lote: ${reAssignedAssignedClassProjectsIds.join(
          ', ',
        )}`,
      );
    }

    batch.class_projects = [...batch.class_projects, ...classProjectsToAssign];

    await this.batchRepository.save(batch);

    return {
      status: 'ok',
    };
  }

  public async removeClassProject(
    batch_id: string,
    user_id: string,
    removeClassProjectsDTO: RemoveClassProjectsDTO,
  ): Promise<any> {
    if (removeClassProjectsDTO.class_projects_ids.length === 0) {
      throw new BadRequestException(
        'Lista de categorias de projetos de assentamento para remove do lote deve possuir ao menos um ID de projetos de assentamento.',
      );
    }

    if (validation.isDuplicatedIds(removeClassProjectsDTO.class_projects_ids)) {
      throw new BadRequestException(
        'Não é possível remover uma classe repetida do lote.',
      );
    }
    const batch = await this.batchRepository.findOne({
      where: { id: batch_id },
      relations: ['class_projects'],
    });

    if (!batch) {
      throw new NotFoundException('Classe não encontrado.');
    }

    const classProjectsToRemove = await this.classProjectRepository.findBy({
      id: In(removeClassProjectsDTO.class_projects_ids),
    });

    const foundClassProjectsIds = classProjectsToRemove.map((spc) => spc.id);

    const missingClassProjectsIds =
      removeClassProjectsDTO.class_projects_ids.filter(
        (id) => !foundClassProjectsIds.includes(id),
      );

    if (missingClassProjectsIds.length > 0) {
      throw new NotFoundException(
        `Os seguintes IDs de classes não foram encontrados: ${missingClassProjectsIds.join(
          ', ',
        )}`,
      );
    }

    if (batch.class_projects.length === 0) {
      throw new NotFoundException(
        'Lote não possui classes atribuidas para serem removidas.',
      );
    }

    const alreadyAssignedClassProjectsIds = batch.class_projects.map(
      (cp) => cp.id,
    );

    const reAssignedAssignedClassProjectsIds =
      removeClassProjectsDTO.class_projects_ids.filter(
        (id) => !alreadyAssignedClassProjectsIds.includes(id),
      );

    if (reAssignedAssignedClassProjectsIds.length > 0) {
      throw new BadRequestException(
        `Os seguintes IDs de classes não foram atribuidos a este lote: ${reAssignedAssignedClassProjectsIds.join(
          ', ',
        )}`,
      );
    }

    batch.class_projects = batch.class_projects.filter(
      (cp) => !removeClassProjectsDTO.class_projects_ids.includes(cp.id),
    );

    await this.batchRepository.save(batch);

    return {
      status: 'ok',
    };
  }

  public async remove(batch_id: string, user_id: string): Promise<any> {
    const batch = await this.batchRepository.findOne({
      where: { id: batch_id },
      relations: ['batch_observations'],
    });

    if (!batch) {
      throw new NotFoundException('Lote não encontrado.');
    }

    console.log('batch', batch);

    await this.batchRepository.softRemove(batch);

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
      throw new NotFoundException('Lote não encontrado.');
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

  public async assignmentMe(
    batch_id: string,
    user_id: string,
  ): Promise<CreatedBatchAssingmentResponse> {
    const user = await this.userRepository.findOne({
      where: {
        id: user_id,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const batch = await this.batchRepository.findOne({
      where: { id: batch_id },
      relations: ['assignedUsers'],
    });

    if (!batch) {
      throw new NotFoundException('Lote não encontrado.');
    }

    if (batch.assignedUsers.find((au) => au.id === user_id)) {
      throw new BadRequestException('Usuário já é responsável pelo lote.');
    }

    const alreadyAssignedUserIds = batch.assignedUsers.map((user) => user.id);

    if (validation.isAssignmentUsersCountInvalid(alreadyAssignedUserIds)) {
      throw new BadRequestException(
        `Lote já possui a quantidade máxima ${MAX_USERS_ASSIGN_TO_BATCH} usuários atribuidos.`,
      );
    }

    batch.assignedUsers = [...batch.assignedUsers, user];

    const savedBatch = await this.batchRepository.save(batch);

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
      throw new NotFoundException('Lote não encontrado.');
    }

    if (batch.assignedUsers.length === 0) {
      throw new NotFoundException(
        'Lote não possui usuários atribuidos para serem removidos.',
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
      throw new NotFoundException('Lote não encontrado.');
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
      throw new NotFoundException('Observação de lote não encontrada.');
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

  public async updateBatchObservationPending(
    batch_observation_id: string,
    user_id: string,
  ): Promise<UpdateBatchObservationPendingResponse> {
    const batchObservation = await this.batchObservationRepository.findOne({
      where: {
        id: batch_observation_id,
      },
      select: ['id', 'is_pending', 'user_id'],
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

    batchObservation.is_pending = !Boolean(batchObservation.is_pending);

    await this.batchObservationRepository.save(batchObservation);

    return {
      status: 'ok',
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
      throw new NotFoundException('Observação de lote não encontrada.');
    }

    const deletedBatchObservation =
      await this.batchObservationRepository.softRemove(batchObservation);

    return {
      id: deletedBatchObservation.id,
      deleted_at: deletedBatchObservation.deleted_at,
    };
  }
}
