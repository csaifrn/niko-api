import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../../../common/enums/user-role.enum';
import { UserPhoto } from './user-photo.entity';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: UserRole.OPERATOR })
  role: string;

  @Column({ select: false })
  password: string;

  @Column({ default: null })
  reseted_password_at?: Date;

  @OneToOne(() => UserPhoto, (userPhoto) => userPhoto.user, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  photo?: UserPhoto;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deleted_at: Date;
}
