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

@Injectable()
export class BatchesService {
  constructor(
    @InjectRepository(Batch)
    private readonly batchRepository: Repository<Batch>,
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

  public async findOne(
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
}
