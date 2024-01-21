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

@Entity('settlement_project_categories')
export class SettlementProjectCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'user_id' })
  user_id: string;

  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Outros imports e decoradores...

  @ManyToMany(() => Batch, (batch) => batch.settlement_project_categories)
  @JoinTable({
    name: 'batches_settlement_project_categories',
    joinColumn: {
      name: 'settlement_project_category_id',
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
