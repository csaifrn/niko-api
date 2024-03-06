import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDTO } from './create-user.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateUserDTO extends PartialType(
  OmitType(CreateUserDTO, ['password', 'passwordConfirm', 'email'] as const),
) {
  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsOptional()
  readonly email?: string;

  @IsBoolean()
  @IsOptional()
  readonly saw_tutorial?: boolean;
}
