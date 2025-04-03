import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Booking } from './booking.entity';

@Entity()
export class Field {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  placeId: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ type: 'text', nullable: true })
  additionalInfo: string;

  @OneToMany(() => Booking, (booking) => booking.field)
  bookings: Booking[];
}
