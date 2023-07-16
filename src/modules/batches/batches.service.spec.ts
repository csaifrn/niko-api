import { Test, TestingModule } from '@nestjs/testing';
import { BatchesService } from './batches.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Batch } from './entities/batche.entity';
import { Repository } from 'typeorm';
import { CreateBatchDTO } from './dto/create-batch.dto';
import { UpdateBatchDTO } from './dto/update-batch.dto';

describe('BatchesService', () => {
  let service: BatchesService;
  let batchRepository: Repository<Batch>;
  const uuidPattern =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

  const mockedBatch = {
    id: 'bca41e37-ef76-4489-8d5e-df0304d5517a',
    settlement_project: 'Projeto Assentamento',
  };

  const user_id = '5b1ee27d-1e3f-4aad-be5e-3be6fd7fea78';

  const batch_id = 'bca41e37-ef76-4489-8d5e-df0304d5517a';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BatchesService,
        {
          provide: getRepositoryToken(Batch),
          useValue: {
            findOne: jest.fn().mockResolvedValue({ ...mockedBatch }),
            create: jest.fn(),
            save: jest.fn().mockResolvedValue(mockedBatch),
          },
        },
      ],
    }).compile();

    service = module.get<BatchesService>(BatchesService);
    batchRepository = module.get<Repository<Batch>>(getRepositoryToken(Batch));
    jest.clearAllMocks();
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

  describe('Update batch', () => {
    it('should update a batch', async () => {
      const batch: UpdateBatchDTO = {
        settlement_project: 'Projeto Assentamento Santa Cruz',
      };

      const updatedBatchMock = {
        id: 'bca41e37-ef76-4489-8d5e-df0304d5517b',
        settlement_project: batch.settlement_project,
      };

      jest
        .spyOn(batchRepository, 'findOne')
        .mockResolvedValue(updatedBatchMock as any);
      jest
        .spyOn(batchRepository, 'save')
        .mockResolvedValue(updatedBatchMock as any);

      const updatedBatch = await service.update(batch_id, { ...batch });

      expect(updatedBatch).toMatchObject({
        settlement_project: 'Projeto Assentamento Santa Cruz',
      });
      expect(batchRepository.findOne).toHaveBeenCalledTimes(1);
      expect(batchRepository.save).toHaveBeenCalledTimes(1);
      expect(updatedBatch.id).toBeDefined();
      expect(updatedBatch.id).toMatch(uuidPattern);
    });

    it('should return the own batch if no body is provided', async () => {
      const batch: UpdateBatchDTO = {};

      const updatedBatch = await service.update(batch_id, batch);

      expect(updatedBatch).toMatchObject({
        settlement_project: 'Projeto Assentamento',
      });
      expect(batchRepository.findOne).toHaveBeenCalledTimes(1);
      expect(batchRepository.save).not.toHaveBeenCalledTimes(1);
      expect(updatedBatch.id).toBeDefined();
      expect(updatedBatch.id).toMatch(uuidPattern);
    });

    it('throw an error when settlement project is lower than 3 characters', async () => {
      const batch: UpdateBatchDTO = {
        settlement_project: 'Pr',
      };

      await expect(service.update(batch_id, batch)).rejects.toThrowError(
        'Projeto de assentamento deve ter ao menos 3 caracteres.',
      );
    });

    it('throw an error when user is not found', async () => {
      const batch: UpdateBatchDTO = {
        settlement_project: 'Projeto Assentamento Santa Cruz',
      };

      jest.spyOn(batchRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.update(batch_id, {
          ...batch,
        }),
      ).rejects.toThrowError('Projeto de assentamento não encontrado.');
      expect(batchRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });
});
