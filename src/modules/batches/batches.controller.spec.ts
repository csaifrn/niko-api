import { Test, TestingModule } from '@nestjs/testing';
import { BatchesController } from './batches.controller';
import { CreateBatchDTO } from './dto/create-batch.dto';
import { BatchesService } from './batches.service';
import { UpdateBatchDTO } from './dto/update-batch.dto';
import { CreateBatchObservationDTO } from './dto/create-batch-observation.dto';
import { UpdateBatchObservationDTO } from './dto/update-batch-observation.dto';
import { UpdateBatchMainStatusDTO } from './dto/update-batch-main-status.dto';
import { UpdateBatchSpecificStatusDTO } from './dto/update-batch-specific-status.dto';

describe('BatchesController', () => {
  let controller: BatchesController;
  let service: BatchesService;

  const uuidPattern =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

  const user_id = '5b1ee27d-1e3f-4aad-be5e-3be6fd7fea78';
  const batch_id = 'bca41e37-ef76-4489-8d5e-df0304d5517a';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BatchesController],
      providers: [
        {
          provide: BatchesService,
          useValue: {
            create: jest.fn().mockResolvedValue({
              id: '5b1ee27d-1e3f-4aad-be5e-3be6fd7fea78',
              title: 'Projeto Assentamento',
            }),
            findOne: jest.fn().mockResolvedValue({
              id: 'bca41e37-ef76-4489-8d5e-df0304d5517a',
              title: 'Projeto de Assentamento Santa Cruz',
              created_at: '2023-07-16T23:15:06.942Z',
              updated_at: '2023-07-17T01:24:42.000Z',
              created_by: {
                user_id: '9dcf2dbf-b039-408e-9734-ace0e0e021dc',
                name: 'Nicholas',
              },
            }),
            update: jest.fn().mockResolvedValue({
              id: batch_id,
              title: 'Projeto Assentamento Santa Cruz',
            }),
            updateMainStatus: jest.fn().mockResolvedValue({
              ok: 'ok',
            }),
            updateSpecificStatus: jest.fn().mockResolvedValue({
              ok: 'ok',
            }),
            createBatchObservation: jest.fn().mockResolvedValue({
              id: 'bca41e37-ef76-4489-8d5e-df0304d5517a',
              observation: 'Caixa veio com documentações rasgadas',
              user_id: '5b1ee27d-1e3f-4aad-be5e-3be6fd7fea78',
              batch_id: 'bca41e37-ef76-4489-8d5e-df0304d5517a',
              created_at: '2023-07-16T23:15:06.942Z',
              updated_at: '2023-07-17T01:24:42.000Z',
              deleted_at: null,
            }),
            updateBatchObservation: jest.fn().mockResolvedValue({
              id: 'bca41e37-ef76-4489-8d5e-df0304d5517a',
              observation: 'Caixa veio com 5 documentações rasgadas',
              user_id: '5b1ee27d-1e3f-4aad-be5e-3be6fd7fea78',
              batch_id: 'bca41e37-ef76-4489-8d5e-df0304d5517a',
              created_at: '2023-07-16T23:15:06.942Z',
              updated_at: '2023-07-17T01:24:42.000Z',
              deleted_at: null,
            }),
            softDeleteBatchObservation: jest.fn().mockResolvedValue({
              id: batch_id,
              deleted_at: '2023-07-19T15:32:05.000Z',
            }),
            createAssignment: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BatchesController>(BatchesController);
    service = module.get<BatchesService>(BatchesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a batch', async () => {
      const body: CreateBatchDTO = {
        title: 'Projeto Assentamento',
        physical_files_count: 12,
        priority: false,
      };

      const req = { user: { id: user_id } };

      const newBatch = await controller.create(body, req);

      expect(newBatch).toMatchObject({
        title: 'Projeto Assentamento',
      });
      expect(newBatch.id).toMatch(uuidPattern);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(body, user_id);
    });
  });

  describe('findOne', () => {
    it('should return a batch', async () => {
      const batch = await controller.findOne(batch_id);

      expect(batch).toMatchObject({
        id: 'bca41e37-ef76-4489-8d5e-df0304d5517a',
        title: 'Projeto de Assentamento Santa Cruz',
        created_at: '2023-07-16T23:15:06.942Z',
        updated_at: '2023-07-17T01:24:42.000Z',
        created_by: {
          user_id: '9dcf2dbf-b039-408e-9734-ace0e0e021dc',
          name: 'Nicholas',
        },
      });
      expect(batch.id).toMatch(uuidPattern);
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(service.findOne).toHaveBeenCalledWith(batch_id);
    });
  });

  describe('update', () => {
    it('should update a batch', async () => {
      const body: UpdateBatchDTO = {
        title: 'Projeto Assentamento Santa Cruz',
      };

      const updatedBatch = await controller.update(batch_id, body);

      expect(updatedBatch).toMatchObject({
        title: 'Projeto Assentamento Santa Cruz',
      });
      expect(updatedBatch.id).toMatch(uuidPattern);
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(batch_id, body);
    });
  });

  describe('create batch observation', () => {
    it('should create a batch observation', async () => {
      const req = { user: { id: user_id } };

      const body: CreateBatchObservationDTO = {
        observation: 'Caixa veio com documentações rasgadas',
      };

      const createdBatchObservation = await controller.createBatchObsevation(
        batch_id,
        req,
        body,
      );

      expect(createdBatchObservation).toMatchObject({
        observation: 'Caixa veio com documentações rasgadas',
      });
      expect(createdBatchObservation.id).toMatch(uuidPattern);
      expect(service.createBatchObservation).toHaveBeenCalledTimes(1);
      expect(service.createBatchObservation).toHaveBeenCalledWith(
        batch_id,
        user_id,
        body,
      );
    });
  });

  describe('update batch observation', () => {
    it('should update a batch observation', async () => {
      const req = { user: { id: user_id } };
      const body: UpdateBatchObservationDTO = {
        observation: 'Caixa veio com 5 documentações rasgadas',
      };

      const updatedBatchObservation = await controller.updateBatchObsevation(
        batch_id,
        req,
        body,
      );

      expect(updatedBatchObservation).toMatchObject({
        observation: 'Caixa veio com 5 documentações rasgadas',
      });
      expect(updatedBatchObservation.id).toMatch(uuidPattern);
      expect(service.updateBatchObservation).toHaveBeenCalledTimes(1);
      expect(service.updateBatchObservation).toHaveBeenCalledWith(
        batch_id,
        req.user.id,
        body,
      );
    });
  });

  describe('update status batch', () => {
    it('should update main status', async () => {
      const req = { user: { id: user_id } };
      const body: UpdateBatchMainStatusDTO = {
        main_status: 1,
      };

      const updatedBatchObservation = await controller.updateMainBatchStatus(
        batch_id,
        body,
        req,
      );

      expect(updatedBatchObservation).toMatchObject({
        ok: 'ok',
      });
      expect(service.updateMainStatus).toHaveBeenCalledTimes(1);
      expect(service.updateMainStatus).toHaveBeenCalledWith(
        batch_id,
        req.user.id,
        body,
      );
    });

    it('should update main status', async () => {
      const req = { user: { id: user_id } };
      const body: UpdateBatchSpecificStatusDTO = {
        specific_status: 1,
      };

      const updatedBatchObservation =
        await controller.updateSpecificBatchStatus(batch_id, body, req);

      expect(updatedBatchObservation).toMatchObject({
        ok: 'ok',
      });
      expect(service.updateSpecificStatus).toHaveBeenCalledTimes(1);
      expect(service.updateSpecificStatus).toHaveBeenCalledWith(
        batch_id,
        req.user.id,
        body,
      );
    });
  });

  describe('delete batch observation', () => {
    it('should delete a batch observation', async () => {
      const deletedBatchObservation = await controller.deleteBatchObsevation(
        batch_id,
      );

      expect(deletedBatchObservation).toMatchObject({
        id: batch_id,
        deleted_at: '2023-07-19T15:32:05.000Z',
      });
      expect(deletedBatchObservation.id).toMatch(uuidPattern);
      expect(service.softDeleteBatchObservation).toHaveBeenCalledTimes(1);
      expect(service.softDeleteBatchObservation).toHaveBeenCalledWith(batch_id);
    });
  });
});
