import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Batch } from '../../batches/entities/batch.entity';

@Entity('class_projects')
export class ClassProject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: false })
  priority?: boolean;

  @Column({ name: 'user_id' })
  user_id: string;

  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToMany(() => Batch, (batch) => batch.class_projects)
  @JoinTable({
    name: 'batches_class_projects',
    joinColumn: {
      name: 'class_project_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'batch_id',
      referencedColumnName: 'id',
    },
  })
  batches?: Batch[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deleted_at: Date;
}
