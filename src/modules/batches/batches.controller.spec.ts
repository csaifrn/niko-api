import { Test, TestingModule } from '@nestjs/testing';
import { BatchesController } from './batches.controller';
import { CreateBatchDTO } from './dto/create-batch.dto';
import { BatchesService } from './batches.service';
import { UpdateBatchDTO } from './dto/update-batch.dto';

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
              settlement_project: 'Projeto Assentamento',
            }),
            update: jest.fn().mockResolvedValue({
              id: batch_id,
              settlement_project: 'Projeto Assentamento Santa Cruz',
            }),
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
        settlement_project: 'Nicholas Tavares',
      };

      const req = { user: { id: user_id } };

      const newBatch = await controller.create(body, req);

      expect(newBatch).toMatchObject({
        settlement_project: 'Projeto Assentamento',
      });
      expect(newBatch.id).toMatch(uuidPattern);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(body, user_id);
    });
  });

  describe('update', () => {
    it('should update a batch', async () => {
      const body: UpdateBatchDTO = {
        settlement_project: 'Projeto Assentamento Santa Cruz',
      };

      const updatedBatch = await controller.update(batch_id, body);

      expect(updatedBatch).toMatchObject({
        settlement_project: 'Projeto Assentamento Santa Cruz',
      });
      expect(updatedBatch.id).toMatch(uuidPattern);
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(batch_id, body);
    });
  });
});
