import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Batch } from './entities/batche.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBatchDTO } from './dto/create-batch.dto';
import { CreatedBatchResponse } from './interfaces/create-batch-response.interface';
import * as validation from '../../utils/validationFunctions.util';
import { UpdateBatchDTO } from './dto/update-batch.dto';
import { UpdatedBatchResponse } from './interfaces/updated-batch-response.interface';
import { GetBatchResponse } from './interfaces/get-batch-response.interface';
import { CreateBatchObservationDTO } from './dto/create-batch-observation.dto';
import { BatchObservation } from './entities/batche_observations.entity';
import { CreatedBatchObservationResponse } from './interfaces/create-batch-observation-response.interface';
import { UpdateBatchObservationDTO } from './dto/update-batch-observation.dto';
import { UpdatedBatchObservationResponse } from './interfaces/updated-batch-observation-response.interface';

@Injectable()
export class BatchesService {
  constructor(
    @InjectRepository(Batch)
    private readonly batchRepository: Repository<Batch>,
    @InjectRepository(BatchObservation)
    private readonly batchObservationRepository: Repository<BatchObservation>,
  ) {}

  public async create(
    createBatchDTO: CreateBatchDTO,
    user_id: string,
  ): Promise<CreatedBatchResponse> {
    if (
      validation.isSettlementProjectValid(createBatchDTO.settlement_project)
    ) {
      throw new BadRequestException(
        'Projeto de assentamento deve ter ao menos 3 caracteres.',
      );
    }

    const batch = this.batchRepository.create({
      ...createBatchDTO,
      user_id,
    });

    const savedBatch = await this.batchRepository.save(batch);

    return {
      id: savedBatch.id,
      settlement_project: savedBatch.settlement_project,
    };
  }

  public async findOne(batch_id: string): Promise<GetBatchResponse> {
    const batch = await this.batchRepository
      .createQueryBuilder('batch')
      .innerJoin('batch.user', 'user')
      .where('batch.id = :id', { id: batch_id })
      .select([
        'batch.id as id',
        'batch.settlement_project as settlement_project',
        'batch.created_at as created_at',
        'batch.updated_at as updated_at',
      ])
      .addSelect(['user.id as user_id', 'user.name as name'])
      .getRawOne();

    if (!batch) {
      throw new NotFoundException('Projeto de assentamento não encontrado.');
    }

    return {
      id: batch.id,
      settlement_project: batch.settlement_project,
      created_at: batch.created_at,
      updated_at: batch.updated_at,
      created_by: {
        user_id: batch.user_id,
        name: batch.name,
      },
    };
  }

  public async update(
    batch_id: string,
    updateBatchDTO: UpdateBatchDTO,
  ): Promise<UpdatedBatchResponse> {
    const batch = await this.batchRepository.findOne({
      where: {
        id: batch_id,
      },
      select: ['id', 'settlement_project'],
    });

    if (!batch) {
      throw new NotFoundException('Projeto de assentamento não encontrado.');
    }

    if (!updateBatchDTO.settlement_project) {
      return batch;
    }

    if (
      validation.isSettlementProjectValid(updateBatchDTO.settlement_project)
    ) {
      throw new BadRequestException(
        'Projeto de assentamento deve ter ao menos 3 caracteres.',
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
      settlement_project: savedBatch.settlement_project,
    };
  }

  public async createBatchObservation(
    batch_id: string,
    user_id: string,
    createBatchObservationDTO: CreateBatchObservationDTO,
  ): Promise<CreatedBatchObservationResponse> {
    if (
      validation.isBatchObservationValid(createBatchObservationDTO.observation)
    ) {
      throw new BadRequestException(
        'Observação deve ter ao menos 3 caracteres.',
      );
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
    updateBatchObservationDTO: UpdateBatchObservationDTO,
  ): Promise<UpdatedBatchObservationResponse> {
    const batchObservation = await this.batchObservationRepository.findOne({
      where: {
        id: batch_observation_id,
      },
      select: ['id', 'observation'],
    });

    if (!batchObservation) {
      throw new NotFoundException(
        'Observação de projeto de assentamento não encontrada.',
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
}
