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
@Index('IDX_comment_user_id', ['user'])
@Index('IDX_comment_field_id', ['field'])
@Index('IDX_comment_created_at', ['createdAt'])
@Index('IDX_comment_field_created_at', ['field', 'createdAt'])
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  text: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @ManyToOne(() => Field, (field) => field.comments)
  field: Field;
}
