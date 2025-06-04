import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field } from './field.entity';
import { User } from './user.entity';

@Entity()
@Index('IDX_booking_user_id', ['user'])
@Index('IDX_booking_field_id', ['field'])
@Index('IDX_booking_status', ['status'])
@Index('IDX_booking_start_time', ['startTime'])
@Index('IDX_booking_end_time', ['endTime'])
@Index('IDX_booking_created_at', ['createdAt'])
@Index('IDX_booking_field_status', ['field', 'status'])
@Index('IDX_booking_user_status', ['user', 'status'])
@Index('IDX_booking_field_time_range', ['field', 'startTime', 'endTime'])
@Index('IDX_booking_time_range', ['startTime', 'endTime'])
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.bookings, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Field, (field) => field.bookings, { onDelete: 'CASCADE' })
  field: Field;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @Column({ default: 'pending' })
  status: 'pending' | 'confirmed' | 'cancelled';

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'numeric', nullable: true })
  finalPrice: number;
}
