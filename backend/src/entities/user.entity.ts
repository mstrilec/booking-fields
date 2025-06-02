import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Booking } from './booking.entity';
import { Comment } from './comment.entity';

@Entity()
@Index('IDX_user_email', ['email'])
@Index('IDX_user_role', ['role'])
@Index('IDX_user_registration_date', ['registrationDate'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: 'user' })
  role: 'admin' | 'user';

  @Column({ nullable: true })
  phoneNumber: string;

  @CreateDateColumn()
  registrationDate: Date;

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
