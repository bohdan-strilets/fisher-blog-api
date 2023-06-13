import { Controller, Get, Param } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { ResponseType } from './types/response.type';
import { CommentDocument } from './schemas/comment.schema';

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
}
