import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { CreatedUserResponse } from './interfaces/create-user-response.interface';
import * as validation from '../../utils/validationFunctions.util';
import { hash } from 'bcrypt';
import { FindUserForAuth } from './interfaces/find-user-for-auth.interface';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UpdatedUserResponse } from './interfaces/update-user-response.interface';
import { CreateRequestResetPasswordUserDTO } from './dto/create-request-reset-password-user.dto';
import { SendMailProducerService } from '../jobs/send-mail-producer.service';
import { ResetPasswordTokenService } from '../reset_password_token/reset_password_token.service';
import { VerifyResetPasswordUserDTO } from './dto/verify-reset-password.dto';
import { AutocompleteResponse } from './interfaces/autocomplete-response.interface';
import { MeResponse } from './interfaces/me-response.interface';
import { Request } from 'express';
import { UserPhoto } from './entities/user-photo.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserPhoto)
    private readonly userPhotoRepository: Repository<UserPhoto>,
    private readonly sendMailProducerService: SendMailProducerService,
    private readonly resetPasswordTokenService: ResetPasswordTokenService,
  ) {}

  public async create({
    name,
    email,
    password,
    role,
    passwordConfirm,
  }: CreateUserDTO): Promise<CreatedUserResponse> {
    if (validation.isNameValid(name)) {
      throw new BadRequestException('Nome deve ter ao menos 6 caracteres.');
    }

    if (!validation.isEmailValid(email)) {
      throw new BadRequestException('Email inválido.');
    }

    if (role && validation.isRoleInvalid(role)) {
      throw new BadRequestException('Nível de acesso inválido.');
    }

    if (!validation.isPasswordValid(password)) {
      throw new BadRequestException(
        'A senha deve conter no mínimo 6 caracters, letras maiúsculas e minúsculas, números e caracteres especiais.',
      );
    }

    if (password !== passwordConfirm) {
      throw new BadRequestException(
        'Senha e confirmação de senha são diferentes.',
      );
    }

    const existingUserCount = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .take(1)
      .getCount();

    if (existingUserCount) {
      throw new BadRequestException(
        'Email já existe. Por favor, use outro email.',
      );
    }

    const hashedPassword = await hash(password, 10);

    const user = this.userRepository.create({
      name,
      email,
      role,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    return {
      id: savedUser.id,
      name: savedUser.name,
      role: savedUser.role,
      email: savedUser.email,
    };
  }

  async uploadPhoto(user_id: string, file: Express.Multer.File, req: Request) {
    const user = await this.userRepository.findOne({
      where: {
        id: user_id,
      },
      relations: ['photo'],
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const photo = {
      fileName: file.filename,
      contentLength: file.size,
      contentType: file.mimetype,
      url: `${req.protocol}://${req.get('host')}/files/${file.filename}`,
    };

    if (user.photo) {
      await this.userPhotoRepository.delete(user.photo.id);
    }

    const p = this.userPhotoRepository.create({
      ...photo,
      user_id: user.id,
    });

    await this.userPhotoRepository.save(p);

    return {
      status: 'ok',
    };
  }

  async removePhoto(user_id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: user_id,
      },
      relations: ['photo'],
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    if (user.photo) {
      await this.userPhotoRepository.delete(user.photo.id);
    }

    return {
      status: 'ok',
    };
  }

  async find(): Promise<User[]> {
    const users = await this.userRepository.find();

    return users;
  }

  async me(user_id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: user_id,
      },
      relations: ['photo'],
      select: ['id', 'name', 'email', 'reseted_password_at', 'saw_tutorial'],
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      saw_tutorial: Boolean(user.saw_tutorial),
      photo: user.photo && {
        id: user.photo.id,
        url: user.photo.url,
        fileName: user.photo.fileName,
        contentType: user.photo.contentType,
      },
      reseted_password_at: user?.reseted_password_at,
    };
  }

  async findUserByEmailForAuth(email: string): Promise<FindUserForAuth | null> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .select([
        'user.id as id',
        'user.name as name',
        'user.password as password',
        'user.role as role',
      ])
      .getRawOne();

    return user;
  }

  public async update(
    user_id: string,
    updateUserDTO: UpdateUserDTO,
  ): Promise<UpdatedUserResponse> {
    if (Object.keys(updateUserDTO).length === 0 || updateUserDTO === null) {
      throw new BadRequestException(
        'Para atualizar usuário é necessário no mínimo preencher um campo.',
      );
    }

    const user = await this.userRepository.findOne({
      where: {
        id: user_id,
      },
      select: ['id'],
    });

    if (!user) {
      throw new NotFoundException('User não encontrado.');
    }

    const filteredDTO = Object.fromEntries(
      Object.entries(updateUserDTO).filter(
        ([, value]) => value !== null && value !== undefined,
      ),
    );

    Object.assign(user, filteredDTO);

    const savedUser = await this.userRepository.save(user);

    return {
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
      saw_tutorial: Boolean(savedUser.saw_tutorial),
      updated_at: savedUser.updated_at,
    };
  }

  async requestResetPassword({ email }: CreateRequestResetPasswordUserDTO) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
      select: ['id'],
    });

    if (!user) return;

    return await this.sendMailProducerService.sendMailToken({
      user_id: user.id,
      email,
      subject: 'Recuperar senha',
      endpoint: 'users/reset-password',
      valid_time: '10 minutos',
      type: 'PASSWORD',
    });
  }

  async verifyResetPassword(
    token_hash: string,
    { password, passwordConfirm }: VerifyResetPasswordUserDTO,
  ) {
    if (password !== passwordConfirm) {
      throw new BadRequestException(
        'Senha e confirmação de senha são diferentes.',
      );
    }

    const token = await this.resetPasswordTokenService.findOne(token_hash);

    if (!token) {
      throw new BadRequestException('Token inválido');
    }

    const now = Date.now();

    if (token.expires_at <= now) {
      await this.resetPasswordTokenService.delete(token.id);
      throw new BadRequestException('Token expirado!');
    }

    const newPassword = await hash(password, 10);

    const user = await this.userRepository.preload({
      id: token.user_id,
      password: newPassword,
      reseted_password_at: new Date(),
    });

    const savedUser = await this.userRepository.save(user);

    await this.resetPasswordTokenService.delete(token.id);

    const formatedDate = new Date(now).toLocaleString('pt-br', {
      timeZone: 'America/Sao_paulo',
    });

    // TODO: remover tokens de acesso para encerrar sessões em outro dispositivos

    return await this.sendMailProducerService.sendMail({
      email: savedUser.email,
      subject: 'Senha recuperada',
      text: `Olá, ${savedUser.name}! Sua senha foi recuperada com sucesso em: ${formatedDate}.`,
    });
  }

  public async autocomplete(name: string): Promise<AutocompleteResponse> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.name LIKE :name', {
        name: `%${name}%`,
      })
      .select(['user.id as id ', 'user.name as name'])
      .getRawMany();

    return {
      searchedText: name,
      users: users,
    };
  }
}
