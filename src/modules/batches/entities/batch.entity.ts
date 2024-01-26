import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ClassProject } from '../../class_projects/entities/class_project';
import { BatchObservation } from './batch_observations.entity';
import { Tag } from '../../tags/entitites/tag.entity';

@Entity('batches')
export class Batch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ default: 0, unsigned: true, type: 'tinyint' })
  main_status: number;

  @Column({ default: 0, unsigned: true, type: 'tinyint' })
  specific_status: number;

  @Column({ default: 0, unsigned: true })
  digital_files_count?: number;

  @Column({ default: 0, unsigned: true })
  physical_files_count?: number;

  @Column({ default: false })
  priority?: boolean;

  @Column({ nullable: true, unique: true })
  shelf_number?: string;

  @Column({ nullable: true })
  storage_location?: string;

  @Column({ name: 'user_id' })
  user_id: string;

  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'batch_assigned_users',
    joinColumn: {
      name: 'batch_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  assignedUsers?: User[];

  @ManyToMany(() => Tag)
  @JoinTable({
    name: 'batches_tags',
    joinColumn: {
      name: 'batch_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
  })
  tags?: Tag[];

  @ManyToMany(() => ClassProject, (classProject) => classProject.batches)
  class_projects: ClassProject[];

  @OneToMany(
    () => BatchObservation,
    (batchObservation) => batchObservation.batch,
  )
  batch_observations: BatchObservation[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deleted_at: Date;
}
