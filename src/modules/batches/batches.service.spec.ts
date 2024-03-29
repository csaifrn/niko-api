import { Test, TestingModule } from '@nestjs/testing';
import { BatchesService } from './batches.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Batch } from './entities/batch.entity';
import { Repository } from 'typeorm';
import { CreateBatchDTO } from './dto/create-batch.dto';
import { UpdateBatchDTO } from './dto/update-batch.dto';
import { BatchObservation } from './entities/batch_observations.entity';
import { CreateBatchObservationDTO } from './dto/create-batch-observation.dto';
import { UpdateBatchObservationDTO } from './dto/update-batch-observation.dto';
import { ClassProject } from '../class_projects/entities/class_project';
import { BatchHistory } from './entities/batch_history.entity';
import { CreateBatchAssingmentDTO } from './dto/create-batch-assingment.dto';
import { User } from '../users/entities/user.entity';
import { UpdateBatchMainStatusDTO } from './dto/update-batch-main-status.dto';
import { UpdateBatchSpecificStatusDTO } from './dto/update-batch-specific-status.dto';
import { Tag } from '../tags/entitites/tag.entity';

describe('BatchesService', () => {
  let service: BatchesService;
  let batchRepository: Repository<Batch>;
  let batchObservationRepository: Repository<BatchObservation>;

  const uuidPattern =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

  const mockedBatch = {
    id: 'ff39505c-d0ea-4529-bcd3-ada4b3e4f1c3',
    title: 'Projeto de Assentamento',
    digital_files_count: 0,
    physical_files_count: 0,
    priority: false,
    shelf_number: null,
    created_at: '2023-09-19T02:12:06.277Z',
    updated_at: '2023-09-19T02:12:06.277Z',
    created_by: {
      user_id: 'c4024599-35a8-49f6-8942-23f625ed59ab',
      name: 'Teste2',
    },
  };
  const mockedBatchObservation = {
    id: 'bca41e37-ef76-4489-8d5e-df0304d5517a',
    observation: 'Caixa veio com documentações rasgadas',
    user_id: '5b1ee27d-1e3f-4aad-be5e-3be6fd7fea78',
    batch_id: 'bca41e37-ef76-4489-8d5e-df0304d5517a',
    created_at: '2023-07-16T23:15:06.942Z',
    updated_at: '2023-07-17T01:24:42.000Z',
    deleted_at: null,
  };

  const mockedUpdatedBatchObservation = {
    id: 'bca41e37-ef76-4489-8d5e-df0304d5517a',
    observation: 'Existem 5 documentações faltando no lote',
    user_id: '5b1ee27d-1e3f-4aad-be5e-3be6fd7fea78',
    batch_id: 'bca41e37-ef76-4489-8d5e-df0304d5517a',
    created_at: '2023-07-16T23:15:06.942Z',
    updated_at: '2023-07-17T01:24:42.000Z',
    deleted_at: null,
  };

  const mockedClassProject = {
    id: '0f31e843-5bdf-43e4-894a-27fbf8217034',
  };

  const user_id = '5b1ee27d-1e3f-4aad-be5e-3be6fd7fea78';
  const batch_id = 'bca41e37-ef76-4489-8d5e-df0304d5517a';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BatchesService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Batch),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockedBatch),
            create: jest.fn(),
            save: jest.fn().mockResolvedValue(mockedBatch),
            createQueryBuilder: jest.fn().mockImplementation(() => ({
              innerJoin: jest.fn().mockReturnThis(),
              innerJoinAndSelect: jest.fn().mockReturnThis(),
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              select: jest.fn().mockReturnThis(),
              addSelect: jest.fn().mockReturnThis(),
              getRawOne: jest.fn().mockResolvedValue(mockedBatch),
              getOne: jest.fn().mockResolvedValue(mockedBatch),
            })),
          },
        },
        {
          provide: getRepositoryToken(BatchObservation),
          useValue: {
            findOne: jest.fn().mockResolvedValue({ ...mockedBatchObservation }),
            create: jest.fn(),
            save: jest.fn().mockResolvedValue({ ...mockedBatchObservation }),
            softRemove: jest.fn().mockResolvedValue({
              id: batch_id,
              deleted_at: '2023-07-19T15:32:05.000Z',
            }),
          },
        },
        {
          provide: getRepositoryToken(BatchHistory),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ClassProject),
          useValue: {
            findOne: jest.fn().mockResolvedValue({ ...mockedClassProject }),
          },
        },
        {
          provide: getRepositoryToken(Tag),
          useValue: {
            findOne: jest.fn(),
            findBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BatchesService>(BatchesService);
    batchRepository = module.get<Repository<Batch>>(getRepositoryToken(Batch));
    batchObservationRepository = module.get<Repository<BatchObservation>>(
      getRepositoryToken(BatchObservation),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create batch', () => {
    it('should create a batch', async () => {
      const batch: CreateBatchDTO = {
        title: 'Projeto de Assentamento',
        physical_files_count: 12,
        priority: false,
      };

      jest.spyOn(batchRepository, 'findOne').mockResolvedValue(null as any);

      const newBatch = await service.create(
        {
          ...batch,
        },
        user_id,
      );

      expect(newBatch).toMatchObject({
        title: 'Projeto de Assentamento',
        physical_files_count: 0,
        digital_files_count: 0,
        priority: false,
      });
      expect(batchRepository.create).toHaveBeenCalledTimes(1);
      expect(batchRepository.save).toHaveBeenCalledTimes(1);
      expect(newBatch.id).toBeDefined();
      expect(newBatch.id).toMatch(uuidPattern);
    });

    it('throw an error when title is lower than 3 characters', async () => {
      const batch: CreateBatchDTO = {
        title: 'Pr',
        physical_files_count: 12,
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

    it('throw an error if title already exists', async () => {
      const batch: CreateBatchDTO = {
        title: 'Projeto Assentamento',
        physical_files_count: 12,
      };

      await expect(
        service.create(
          {
            ...batch,
          },
          user_id,
        ),
      ).rejects.toThrowError(
        'Já existe um lote com esse nome. Escolha outro nome.',
      );
    });
  });

  describe('Update batch', () => {
    it('should update a batch', async () => {
      const batch: UpdateBatchDTO = {
        title: 'Projeto Assentamento Santa Cruz',
        physical_files_count: 5,
        digital_files_count: 2,
      };

      const updatedBatchMock = {
        id: 'bca41e37-ef76-4489-8d5e-df0304d5517b',
        title: batch.title,
        physical_files_count: batch.physical_files_count,
        digital_files_count: batch.digital_files_count,
      };

      jest
        .spyOn(batchRepository, 'findOne')
        .mockResolvedValue(updatedBatchMock as any);
      jest
        .spyOn(batchRepository, 'save')
        .mockResolvedValue(updatedBatchMock as any);

      const updatedBatch = await service.update(batch_id, { ...batch });

      expect(updatedBatch).toMatchObject({
        title: 'Projeto Assentamento Santa Cruz',
        physical_files_count: 5,
        digital_files_count: 2,
      });
      expect(batchRepository.findOne).toHaveBeenCalledTimes(1);
      expect(batchRepository.save).toHaveBeenCalledTimes(1);
      expect(updatedBatch.id).toBeDefined();
      expect(updatedBatch.id).toMatch(uuidPattern);
    });

    it('should update a batch if physical files count is equal to zero', async () => {
      const batch: UpdateBatchDTO = {
        title: 'Projeto Assentamento Santa Cruz',
        physical_files_count: 0,
      };

      const updatedBatchMock = {
        id: 'bca41e37-ef76-4489-8d5e-df0304d5517b',
        title: batch.title,
        physical_files_count: batch.physical_files_count,
      };

      jest
        .spyOn(batchRepository, 'findOne')
        .mockResolvedValue(updatedBatchMock as any);
      jest
        .spyOn(batchRepository, 'save')
        .mockResolvedValue(updatedBatchMock as any);

      const updatedBatch = await service.update(batch_id, { ...batch });

      expect(updatedBatch).toMatchObject({
        title: 'Projeto Assentamento Santa Cruz',
        physical_files_count: 0,
      });
      expect(batchRepository.findOne).toHaveBeenCalledTimes(1);
      expect(batchRepository.save).toHaveBeenCalledTimes(1);
      expect(updatedBatch.id).toBeDefined();
      expect(updatedBatch.id).toMatch(uuidPattern);
    });

    it('should update a batch if digital files count is equal to zero', async () => {
      const batch: UpdateBatchDTO = {
        title: 'Projeto Assentamento Santa Cruz',
        digital_files_count: 0,
      };

      const updatedBatchMock = {
        id: 'bca41e37-ef76-4489-8d5e-df0304d5517b',
        title: batch.title,
        digital_files_count: batch.digital_files_count,
      };

      jest
        .spyOn(batchRepository, 'findOne')
        .mockResolvedValue(updatedBatchMock as any);
      jest
        .spyOn(batchRepository, 'save')
        .mockResolvedValue(updatedBatchMock as any);

      const updatedBatch = await service.update(batch_id, { ...batch });

      expect(updatedBatch).toMatchObject({
        title: 'Projeto Assentamento Santa Cruz',
        digital_files_count: 0,
      });
      expect(batchRepository.findOne).toHaveBeenCalledTimes(1);
      expect(batchRepository.save).toHaveBeenCalledTimes(1);
      expect(updatedBatch.id).toBeDefined();
      expect(updatedBatch.id).toMatch(uuidPattern);
    });

    it('throw an error if no field is provided', async () => {
      const batch: UpdateBatchDTO = {};

      await expect(service.update(batch_id, batch)).rejects.toThrowError(
        'Para atualizar lote é necessário no mínimo preencher um campo.',
      );
    });

    it('throw an error when class project is lower than 3 characters', async () => {
      const batch: UpdateBatchDTO = {
        title: 'Pr',
      };

      await expect(service.update(batch_id, batch)).rejects.toThrowError(
        'Projeto de assentamento deve ter ao menos 3 caracteres.',
      );
    });

    it('throw an error when physical files count is lower than 0', async () => {
      const batch: UpdateBatchDTO = {
        title: 'Projeto Assentamento Santa Cruz',
        physical_files_count: -1,
      };

      await expect(service.update(batch_id, batch)).rejects.toThrowError(
        'Número de documentos físicos deve ser maior ou igual a zero.',
      );
    });

    it('throw an error when digital files count is lower than 0', async () => {
      const batch: UpdateBatchDTO = {
        title: 'Projeto Assentamento Santa Cruz',
        digital_files_count: -1,
      };

      await expect(service.update(batch_id, batch)).rejects.toThrowError(
        'Número de documentos digitais deve ser maior ou igual a zero.',
      );
    });

    it('throw an error when batch is not found', async () => {
      const batch: UpdateBatchDTO = {
        title: 'Projeto Assentamento Santa Cruz',
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

  describe('Get batch', () => {
    it('should return a batch', async () => {
      const queryBuilderMock = {
        innerJoin: jest.fn().mockReturnThis(),
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue(mockedBatch),
        getOne: jest.fn().mockResolvedValue(mockedBatch),
        getRawMany: jest.fn(),
      };

      jest
        .spyOn(batchRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilderMock as any);

      const batch = await service.findOne(batch_id);

      expect(batch).toMatchObject({
        id: 'ff39505c-d0ea-4529-bcd3-ada4b3e4f1c3',
        title: 'Projeto de Assentamento',
        digital_files_count: 0,
        physical_files_count: 0,
        priority: false,
        shelf_number: null,
        created_at: '2023-09-19T02:12:06.277Z',
        updated_at: '2023-09-19T02:12:06.277Z',
      });
      expect(batchRepository.createQueryBuilder).toHaveBeenCalledTimes(2);
      expect(batch.id).toMatch(uuidPattern);
    });

    it('throw an error when batch is not found', async () => {
      const queryBuilderMock = {
        innerJoin: jest.fn().mockReturnThis(),
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue(null),
        getOne: jest.fn().mockResolvedValue(null),
      };

      jest
        .spyOn(batchRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilderMock as any);

      await expect(service.findOne(batch_id)).rejects.toThrowError(
        'Projeto de assentamento não encontrado.',
      );
      expect(batchRepository.createQueryBuilder).toHaveBeenCalledTimes(1);
    });
  });

  describe('Update status batch', () => {
    it('should update main batch status', async () => {
      const main_status: UpdateBatchMainStatusDTO = {
        main_status: 0,
      };

      const updatedMainStatusBatch = await service.updateMainStatus(
        batch_id,
        user_id,
        {
          ...main_status,
        },
      );

      expect(updatedMainStatusBatch).toMatchObject({
        status: 'ok',
      });
      expect(batchRepository.findOne).toHaveBeenCalledTimes(1);
      expect(batchRepository.save).toHaveBeenCalledTimes(1);
    });
    it('throw an error when main status is not in update status batch enum', async () => {
      const main_status: UpdateBatchMainStatusDTO = {
        main_status: 9,
      };

      await expect(
        service.updateMainStatus(batch_id, user_id, {
          ...main_status,
        }),
      ).rejects.toThrowError(
        'Atualização de status principal inválida. Insira um status válido.',
      );
    });

    it('throw an error when batch is not found', async () => {
      const main_status: UpdateBatchMainStatusDTO = {
        main_status: 2,
      };

      jest.spyOn(batchRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.updateMainStatus(batch_id, user_id, {
          ...main_status,
        }),
      ).rejects.toThrowError('Projeto de assentamento não encontrado.');
      expect(batchRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should update specific batch status', async () => {
      const specific_status: UpdateBatchSpecificStatusDTO = {
        specific_status: 1,
      };

      const updatedSpecificStatusBatch = await service.updateSpecificStatus(
        batch_id,
        user_id,
        {
          ...specific_status,
        },
      );

      expect(updatedSpecificStatusBatch).toMatchObject({
        status: 'ok',
      });
      expect(batchRepository.findOne).toHaveBeenCalledTimes(1);
      expect(batchRepository.save).toHaveBeenCalledTimes(1);
    });
    it('throw an error when especific status is not in update status batch enum', async () => {
      const specific_status: UpdateBatchSpecificStatusDTO = {
        specific_status: 9,
      };

      await expect(
        service.updateSpecificStatus(batch_id, user_id, {
          ...specific_status,
        }),
      ).rejects.toThrowError(
        'Atualização de status específico inválida. Insira um status válido.',
      );
    });
  });

  describe('Create assignment', () => {
    it('throw an error when assignment_users_ids length is equals to zero', async () => {
      const createBatchAssingmentDTO: CreateBatchAssingmentDTO = {
        assignment_users_ids: [],
      };

      await expect(
        service.assignment(batch_id, user_id, {
          ...createBatchAssingmentDTO,
        }),
      ).rejects.toThrowError(
        'Lista de usuários para atribuição de lote deve possuir ao menos um ID de usuário.',
      );
    });
    it('throw an error when batch is not found', async () => {
      const createBatchAssingmentDTO: CreateBatchAssingmentDTO = {
        assignment_users_ids: ['2c4a8c9b-1a82-43c8-851d-92faaa1003b6'],
      };

      jest.spyOn(batchRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.assignment(batch_id, user_id, {
          ...createBatchAssingmentDTO,
        }),
      ).rejects.toThrowError('Projeto de assentamento não encontrado.');
    });
  });

  describe('Create batch observation', () => {
    it('should create a batch observation', async () => {
      const batchObservation: CreateBatchObservationDTO = {
        observation: 'Caixa veio com documentações rasgadas',
      };

      const newBatchObservation = await service.createBatchObservation(
        batch_id,
        user_id,
        {
          ...batchObservation,
        },
      );

      expect(newBatchObservation).toMatchObject({
        observation: 'Caixa veio com documentações rasgadas',
      });
      expect(batchObservationRepository.create).toHaveBeenCalledTimes(1);
      expect(batchObservationRepository.save).toHaveBeenCalledTimes(1);
      expect(newBatchObservation.id).toBeDefined();
      expect(newBatchObservation.id).toMatch(uuidPattern);
    });

    it('throw an error when batch is not found', async () => {
      const batchObservation: CreateBatchObservationDTO = {
        observation: 'Caixa veio com documentações rasgadas',
      };

      jest.spyOn(batchRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.createBatchObservation(batch_id, user_id, {
          ...batchObservation,
        }),
      ).rejects.toThrowError('Projeto de assentamento não encontrado.');
    });

    it('throw an error when batch observation is lower than 3 characters', async () => {
      const batchObservation: CreateBatchObservationDTO = {
        observation: 'Ca',
      };

      await expect(
        service.createBatchObservation(batch_id, user_id, {
          ...batchObservation,
        }),
      ).rejects.toThrowError('Observação deve ter ao menos 3 caracteres.');
    });
  });

  describe('Update batch observation', () => {
    it('should update a batch observation', async () => {
      const batchObservation: UpdateBatchObservationDTO = {
        observation: 'Existem 5 documentações faltando no lote',
      };

      jest
        .spyOn(batchObservationRepository, 'save')
        .mockResolvedValue({ ...mockedUpdatedBatchObservation } as any);

      const updatedBatchObservation = await service.updateBatchObservation(
        batch_id,
        user_id,
        {
          ...batchObservation,
        },
      );

      expect(updatedBatchObservation).toMatchObject({
        observation: 'Existem 5 documentações faltando no lote',
      });
      expect(batchObservationRepository.findOne).toHaveBeenCalledTimes(1);
      expect(batchObservationRepository.save).toHaveBeenCalledTimes(1);
      expect(updatedBatchObservation.id).toBeDefined();
      expect(updatedBatchObservation.id).toMatch(uuidPattern);
    });

    it('throw an error when batch observation is not found', async () => {
      const batchObservation: UpdateBatchObservationDTO = {
        observation: 'Existem 5 documentações faltando no lote',
      };

      jest.spyOn(batchObservationRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.updateBatchObservation(batch_id, user_id, {
          ...batchObservation,
        }),
      ).rejects.toThrowError(
        'Observação de projeto de assentamento não encontrada.',
      );
      expect(batchObservationRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('throw an error when batch observation is lower than 3 characters', async () => {
      const batchObservation: UpdateBatchObservationDTO = {
        observation: 'Ca',
      };

      await expect(
        service.updateBatchObservation(batch_id, user_id, {
          ...batchObservation,
        }),
      ).rejects.toThrowError('Observação deve ter ao menos 3 caracteres.');
    });

    it('throw an error when user_id is different from who created the batch', async () => {
      const user_id = '123';
      const batchObservation: UpdateBatchObservationDTO = {
        observation: 'Existem 5 documentações faltando no lote',
      };

      await expect(
        service.updateBatchObservation(batch_id, user_id, {
          ...batchObservation,
        }),
      ).rejects.toThrowError(
        'Edição de obsevação não autorizada. Usuário não criou observação.',
      );
    });
  });

  describe('soft batch observation', () => {
    it('should soft delete a batch observation and register the time', async () => {
      const deletedBatchObservation = await service.softDeleteBatchObservation(
        batch_id,
      );

      expect(deletedBatchObservation).toMatchObject({
        id: batch_id,
        deleted_at: '2023-07-19T15:32:05.000Z',
      });
      expect(batchObservationRepository.findOne).toHaveBeenCalledTimes(1);
      expect(batchObservationRepository.softRemove).toHaveBeenCalledTimes(1);
      expect(deletedBatchObservation.id).toBeDefined();
      expect(deletedBatchObservation.id).toMatch(uuidPattern);
      expect(deletedBatchObservation.deleted_at).toBeDefined();
    });

    it('throw an error when batch observation is not found', async () => {
      jest.spyOn(batchObservationRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.softDeleteBatchObservation(batch_id),
      ).rejects.toThrowError(
        'Observação de projeto de assentamento não encontrada.',
      );
      expect(batchObservationRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });
});
