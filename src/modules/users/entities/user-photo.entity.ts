import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
@Entity('user-photo')
export class UserPhoto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  fileName: string;

  @Column({ nullable: false })
  contentLength: number;

  @Column({ nullable: false })
  contentType: string;

  @Column({ nullable: false })
  url: string;

  @Column({ name: 'user_id' })
  user_id: string;

  @OneToOne(() => User, (user) => user.photo)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
