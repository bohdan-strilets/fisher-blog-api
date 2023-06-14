import { Body, Controller, Get, Param, Post, Req, UseGuards, Patch, Delete } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { ResponseType } from './types/response.type';
import { CommentDocument } from './schemas/comment.schema';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CommentDto } from './dto/comment.dto';
import { AuthRequest } from 'src/users/types/auth-request.type';

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
    @Body() createCommentDto: CommentDto,
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
    @Body() updateCommentDto: CommentDto,
  ): Promise<ResponseType<CommentDocument> | ResponseType | undefined> {
    const data = await this.commentsService.updateComment(commentId, updateCommentDto);
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete-comment/:postId/:commentId')
  async deleteComment(@Param('commentId') commentId: string): Promise<ResponseType | undefined> {
    const data = await this.commentsService.deleteComment(commentId);
    return data;
  }
}
