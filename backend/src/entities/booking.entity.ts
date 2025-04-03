import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field } from './field.entity';
import { User } from './user.entity';

@Entity()
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
}
