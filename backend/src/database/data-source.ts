import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { Booking } from '../entities/booking.entity';
import { Field } from '../entities/field.entity';
import { User } from '../entities/user.entity';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [User, Field, Booking],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: true,
});
