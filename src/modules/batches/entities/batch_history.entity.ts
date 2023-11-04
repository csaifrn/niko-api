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
import { Batch } from './batch.entity';
@Entity('batches_history')
export class BatchHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Batch, { nullable: false })
  @JoinColumn({ name: 'batch_id' })
  batch: Batch;

  @Column({ name: 'batch_id' })
  batch_id: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'acted_by_id' })
  acted_by: User;

  @Column({ name: 'acted_by_id' })
  acted_by_id: string;

  @Column({ type: 'varchar', length: 200 })
  event_type: string;

  @Column({ nullable: true })
  details: string;

  @ManyToMany(() => User, { cascade: true })
  @JoinTable({
    name: 'batch_history_users',
    joinColumn: { name: 'batch_history_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  users: User[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deleted_at: Date;
}
