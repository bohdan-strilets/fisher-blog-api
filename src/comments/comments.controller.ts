import { Body, Controller, Get, Param, Post, Req, UseGuards, Patch } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { ResponseType } from './types/response.type';
import { CommentDocument } from './schemas/comment.schema';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AuthRequest } from 'src/users/types/auth-request.type';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('all-comments/:postId')
  async getAllComments(
    @Param('postId') postId: string,
  ): Promise<ResponseType<CommentDocument[]> | ResponseType | undefined> {
    const data = await this.commentsService.getAllComments(postId);
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-comment/:postId')
  async createComment(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: AuthRequest,
  ): Promise<ResponseType<CommentDocument> | ResponseType | undefined> {
    const { _id } = req.user;
    const data = await this.commentsService.createComment(postId, _id, createCommentDto);
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-comment/:postId/:commentId')
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<ResponseType<CommentDocument> | ResponseType | undefined> {
    const data = await this.commentsService.updateComment(commentId, updateCommentDto);
    return data;
  }
}
