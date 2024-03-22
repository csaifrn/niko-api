import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'postgres',
  logging: true,
  url: process.env.POSTGRES_URL,
  autoLoadEntities: true,
  synchronize: true,
  entities: ['dist/src/modules/**/entities/*.entity.js'],
  migrations: ['dist/src/migrations/*.js'],
  cli: {
      migrationsDir: 'src/migrations',
  },
}));
