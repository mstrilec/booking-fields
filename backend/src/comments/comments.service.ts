import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { Comment } from '../entities/comment.entity';
import { Field } from '../entities/field.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepo: Repository<Comment>,
    @InjectRepository(Field)
    private fieldsRepo: Repository<Field>,
  ) {}

  async create(dto: CreateCommentDto, userId: number): Promise<Comment> {
    const field = await this.fieldsRepo.findOne({
      where: { placeId: dto.placeId },
    });

    if (!field) {
      throw new NotFoundException(
        `Field with placeId ${dto.placeId} not found`,
      );
    }

    const comment = this.commentsRepo.create({
      text: dto.text,
      user: { id: userId },
      field: { id: field.id },
    });

    return this.commentsRepo.save(comment);
  }

  async findByPlaceId(placeId: string): Promise<Comment[]> {
    const field = await this.fieldsRepo.findOne({
      where: { placeId },
    });

    if (!field) {
      throw new NotFoundException(`Field with placeId ${placeId} not found`);
    }

    return this.commentsRepo.find({
      where: { field: { id: field.id } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async delete(id: number, user: User): Promise<void> {
    const comment = await this.commentsRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (user.role !== 'admin' && comment.user.id !== user.id) {
      throw new Error('Forbidden: You cannot delete this comment');
    }

    await this.commentsRepo.remove(comment);
  }
}
