import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { SettlementProjectCategory } from '../../settlement_project_categories/entities/settlement_project_categories.entity';

@Entity('batches')
export class Batch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  settlement_project: string;

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

  @Column({ name: 'settlement_project_category_id' })
  settlement_project_category_id: string;

  @ManyToOne(
    () => SettlementProjectCategory,
    (settlementProjectCategory) => settlementProjectCategory,
  )
  @JoinColumn({ name: 'settlement_project_category_id' })
  settlement_project_category: SettlementProjectCategory;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deleted_at: Date;
}
