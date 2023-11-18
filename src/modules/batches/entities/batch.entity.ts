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
import { SettlementProjectCategory } from '../../settlement_project_categories/entities/settlement_project_categories.entity';
import { BatchObservation } from './batch_observations.entity';

@Entity('batches')
export class Batch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
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

  @Column({ nullable: true })
  shelf_number?: number;

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

  @Column({ name: 'settlement_project_category_id' })
  settlement_project_category_id: string;

  @ManyToOne(
    () => SettlementProjectCategory,
    (settlementProjectCategory) => settlementProjectCategory,
  )
  @JoinColumn({ name: 'settlement_project_category_id' })
  settlement_project_category: SettlementProjectCategory;

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
