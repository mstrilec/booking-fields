import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { Booking } from '../entities/booking.entity';
import { Comment } from '../entities/comment.entity';
import { Field } from '../entities/field.entity';
import { User } from '../entities/user.entity';

config();

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DATABASE_HOST'),
  port: Number(configService.get('DATABASE_PORT', 5432)),
  username: configService.get('DATABASE_USERNAME'),
  password: configService.get('DATABASE_PASSWORD'),
  database: configService.get('DATABASE_NAME'),
  entities: [User, Field, Booking, Comment],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: configService.get('NODE_ENV') !== 'production',
});
