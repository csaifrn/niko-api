import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'postgres',
  logging: true,
  url: `postgres://niko_wu43_user:1oue8nbg021AATIuZiAJasWgVB31EXts@dpg-cng71lda73kc73ded5ng-a.oregon-postgres.render.com/niko_wu43`,
  autoLoadEntities: true,
  synchronize: true,
  entities: ['dist/src/modules/**/entities/*.entity.js'],
  migrations: ['dist/src/migrations/*.js'],
  cli: {
      migrationsDir: 'src/migrations',
  },
}));
