import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Roles } from '../decorators/roles.decorator';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Role } from '../types/enums';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  @Post()
  async create(@Body() dto: CreateCommentDto, @Req() req: Request) {
    const user = req.user as User;
    return this.commentsService.create(dto, user.id);
  }

  @Get('field/:placeId')
  async findByPlaceId(@Param('placeId') placeId: string) {
    return this.commentsService.findByPlaceId(placeId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  @Delete(':id')
  async delete(@Param('id') id: number, @Req() req: Request) {
    const user = req.user as User;
    return this.commentsService.delete(+id, user);
  }
}
