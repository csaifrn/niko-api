import { SetMetadata } from '@nestjs/common';
// TODO: pesquisar metadata

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
