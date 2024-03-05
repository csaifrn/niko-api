import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  logging: true,
  host: process.env.DB_MAIN_HOST,
  port: +process.env.DB_MAIN_PORT,
  username: process.env.DB_MAIN_USER,
  password: process.env.DB_MAIN_PASSWORD,
  database: process.env.DB_MAIN_DATABASE,
  synchronize: false,
  entities: ['dist/src/modules/**/entities/*.entity.js'],
  migrations: ['dist/src/migrations/*.js'],
});
