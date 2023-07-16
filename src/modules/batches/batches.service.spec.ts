import { Test, TestingModule } from '@nestjs/testing';
import { BatchesService } from './batches.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Batch } from './entities/batche.entity';
import { Repository } from 'typeorm';
import { CreateBatchDTO } from './dto/create-batch.dto';

describe('BatchesService', () => {
  let service: BatchesService;
  let batchRepository: Repository<Batch>;
  const uuidPattern =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

  const mockedBatch = {
    id: '5b1ee27d-1e3f-4aad-be5e-3be6fd7fea78',
    settlement_project: 'Projeto Assentamento',
  };

  const user_id = '5b1ee27d-1e3f-4aad-be5e-3be6fd7fea78';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BatchesService,
        {
          provide: getRepositoryToken(Batch),
          useValue: {
            create: jest.fn(),
            save: jest.fn().mockResolvedValue(mockedBatch),
          },
        },
      ],
    }).compile();

    service = module.get<BatchesService>(BatchesService);
    batchRepository = module.get<Repository<Batch>>(getRepositoryToken(Batch));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create batch', () => {
    it('should create a batch', async () => {
      const batch: CreateBatchDTO = {
        settlement_project: 'Projeto Assentamento',
      };

      const newBatch = await service.create(
        {
          ...batch,
        },
        user_id,
      );

      expect(newBatch).toMatchObject({
        settlement_project: 'Projeto Assentamento',
      });
      expect(batchRepository.create).toHaveBeenCalledTimes(1);
      expect(batchRepository.save).toHaveBeenCalledTimes(1);
      expect(newBatch.id).toBeDefined();
      expect(newBatch.id).toMatch(uuidPattern);
    });

    it('throw an error when settlement project is lower than 3 characters', async () => {
      const batch: CreateBatchDTO = {
        settlement_project: 'Pr',
      };

      await expect(
        service.create(
          {
            ...batch,
          },
          user_id,
        ),
      ).rejects.toThrowError(
        'Projeto de assentamento deve ter ao menos 3 caracteres.',
      );
    });
  });
});
