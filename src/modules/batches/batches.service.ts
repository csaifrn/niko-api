import { BadRequestException, Injectable } from '@nestjs/common';
import { Batch } from './entities/batche.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBatchDTO } from './dto/create-batch.dto';
import { CreatedBatchResponse } from './interfaces/create-batch-response.interface';
import * as validation from '../../utils/validationFunctions.util';

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
}
