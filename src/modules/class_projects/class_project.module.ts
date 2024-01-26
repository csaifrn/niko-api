import { Module } from '@nestjs/common';
import { ClassProjectService } from './class_project.service';
import { ClassProjectsController } from './class_project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassProject } from './entities/class_project';

@Module({
  imports: [TypeOrmModule.forFeature([ClassProject])],
  providers: [ClassProjectService],
  controllers: [ClassProjectsController],
})
export class ClassProjectsModule {}
