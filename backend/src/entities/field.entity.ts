import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Booking } from './booking.entity';
import { Comment } from './comment.entity';

@Entity()
@Index('IDX_field_place_id', ['placeId'], { unique: true })
@Index('IDX_field_name', ['name'])
@Index('IDX_field_price', ['price'])
@Index('IDX_field_rating', ['rating'])
@Index('IDX_field_price_rating', ['price', 'rating'])
@Index('IDX_field_location', ['location'])
export class Field {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  placeId: string;

  @Column({ default: 'Unnamed Field', nullable: false })
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ type: 'text', nullable: true })
  additionalInfo: string;

  @Column('jsonb', { nullable: true })
  location: {
    lat: number;
    lng: number;
  };

  @Column({ nullable: true })
  website: string;

  @Column('jsonb', { nullable: true })
  reviews: any[];

  @Column('jsonb', { nullable: true })
  photos: any[];

  @Column('decimal', { precision: 3, scale: 2, nullable: true })
  rating: number;

  @Column('integer', { nullable: true })
  userRatingTotal: number;

  @OneToMany(() => Booking, (booking) => booking.field)
  bookings: Booking[];

  @OneToMany(() => Comment, (comment) => comment.field)
  comments: Comment[];
}
