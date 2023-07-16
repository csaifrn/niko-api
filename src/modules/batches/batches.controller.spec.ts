import { Test, TestingModule } from '@nestjs/testing';
import { BatchesController } from './batches.controller';
import { CreateBatchDTO } from './dto/create-batch.dto';
import { BatchesService } from './batches.service';

describe('BatchesController', () => {
  let controller: BatchesController;
  let service: BatchesService;

  const uuidPattern =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

  const user_id = '5b1ee27d-1e3f-4aad-be5e-3be6fd7fea78';

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
});
