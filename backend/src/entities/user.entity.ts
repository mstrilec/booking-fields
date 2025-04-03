import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Booking } from './booking.entity';

@Entity()
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
}
