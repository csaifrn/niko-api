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
import { Batch } from './batch.entity';

@Entity('batche_observations')
export class BatchObservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'batch_id' })
  batch_id: string;

  @ManyToOne(() => Batch, (batch) => batch)
  @JoinColumn({ name: 'batch_id' })
  batch: Batch;

  @Column({ name: 'user_id' })
  user_id: string;

  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'text' })
  observation: string;

  @Column({ default: false })
  is_pending?: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deleted_at: Date;
}
