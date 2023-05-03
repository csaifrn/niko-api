import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { CreatedUserResponse } from './interfaces/create-user-response.interface';
import * as validation from '../../utils/validationFunctions.util';
import { hash } from 'bcrypt';
import { FindUserForAuth } from './interfaces/find-user-for-auth.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async create({
    name,
    email,
    password,
    passwordConfirm,
  }: CreateUserDTO): Promise<CreatedUserResponse> {
    if (validation.isNameValid(name)) {
      throw new BadRequestException('Nome deve ter ao menos 6 caracteres.');
    }

    if (!validation.isEmailValid(email)) {
      throw new BadRequestException('Email invalido.');
    }

    if (!validation.isPasswordValid(password)) {
      throw new BadRequestException(
        'A senha deve conter no minimo 6 caracters, letras maiusculas e minusculas, numeros, e caracters especiais.',
      );
    }

    if (password !== passwordConfirm) {
      throw new BadRequestException(
        'Senha e confimacao de senha sao diferentes.',
      );
    }

    const existingUserCount = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .take(1)
      .getCount();

    if (existingUserCount) {
      throw new BadRequestException(
        'Email ja existe. Por favor, use outro email.',
      );
    }

    const hashedPassword = await hash(password, 10);

    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    return {
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
    };
  }

  async findUserByEmailForAuth(email: string): Promise<FindUserForAuth | null> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
      select: ['id', 'name', 'password'],
    });

    return user;
  }
}
