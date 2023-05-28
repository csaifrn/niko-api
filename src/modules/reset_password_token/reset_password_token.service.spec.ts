import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResetPasswordTokenService } from './reset_password_token.service';
import { ResetPasswordToken } from './entities/reset_password_token.entity';

describe('UsersService', () => {
  let service: ResetPasswordTokenService;
  let resetPasswordTokenRepository: Repository<ResetPasswordToken>;
  const uuidPattern =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

  const mockedToken = {
    id: '54e8a03e-a7d3-4d59-b22d-2b3163fbb4c5',
    token: 'd83e9ddc-8dc9-4e62-81fa-3e47627aa9c0',
    user_id: '5b1ee27d-1e3f-4aad-be5e-3be6fd7fea78',
    expires_at: Date.now() + 10 * 60 * 1000,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResetPasswordTokenService,
        {
          provide: getRepositoryToken(ResetPasswordToken),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockedToken),
            create: jest.fn(),
            save: jest.fn().mockResolvedValue(mockedToken),
          },
        },
      ],
    }).compile();

    service = module.get<ResetPasswordTokenService>(ResetPasswordTokenService);
    resetPasswordTokenRepository = module.get<Repository<ResetPasswordToken>>(
      getRepositoryToken(ResetPasswordToken),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(resetPasswordTokenRepository).toBeDefined();
  });

  describe('Find token', () => {
    it('should return a token by hash', async () => {
      const hash = 'd83e9ddc-8dc9-4e62-81fa-3e47627aa9c0';

      const token = await service.findOne(hash);

      expect(token.id).toBeDefined();
      expect(token.expires_at).toBeDefined();
      expect(token.id).toMatch(uuidPattern);
      expect(resetPasswordTokenRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return null if no token was found', async () => {
      const hash = 'd83e9ddc-8dc9-4e62-81fa-3e47627aa9c0';

      jest
        .spyOn(resetPasswordTokenRepository, 'findOne')
        .mockResolvedValue(null);

      expect(await service.findOne(hash)).toBeNull();
      expect(resetPasswordTokenRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('Create token', () => {
    it('should create a token', async () => {
      const user_id = '5b1ee27d-1e3f-4aad-be5e-3be6fd7fea78';

      const token = await service.create(user_id);

      expect(token.id).toBeDefined();
      expect(token.expires_at).toBeDefined();
      expect(token.token).toBeDefined();
      expect(token.user_id).toStrictEqual(user_id);
      expect(token.id).toMatch(uuidPattern);
      expect(resetPasswordTokenRepository.create).toHaveBeenCalledTimes(1);
      expect(resetPasswordTokenRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should create a token that is valid before expiry', async () => {
      const user_id = '5b1ee27d-1e3f-4aad-be5e-3be6fd7fea78';

      const token = await service.create(user_id);

      const timeAfter5Minutes = Date.now() + 5 * 60 * 1000;

      expect(token.expires_at).toBeGreaterThan(timeAfter5Minutes);
    });

    it('should create a token that expires in 10 minutes', async () => {
      const user_id = '5b1ee27d-1e3f-4aad-be5e-3be6fd7fea78';

      const token = await service.create(user_id);

      const fetchedToken = await service.findOne(token.token);

      expect(fetchedToken.expires_at).toBeGreaterThan(Date.now());

      const timeAfter10Minutes = Date.now() + 10 * 60 * 1000;

      const expiredToken = await service.findOne(token.token);
      expect(expiredToken.expires_at).toBeLessThanOrEqual(timeAfter10Minutes);
    });
  });
});
