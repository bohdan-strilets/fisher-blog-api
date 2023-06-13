import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentDocument, Comment } from './schemas/comment.schema';
import { Post, PostDocument } from 'src/posts/schemas/post.schema';
import { ResponseType } from './types/response.type';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private CommentModel: Model<CommentDocument>,
    @InjectModel(Post.name) private PostModel: Model<PostDocument>,
  ) {}

  async getAllComments(
    postId: string,
  ): Promise<ResponseType<CommentDocument[]> | ResponseType | undefined> {
    const comments = await this.CommentModel.find({ post: postId });

    if (!comments) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.NOT_FOUND,
          success: false,
          message: 'Comments for this post not found.',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      data: comments,
    };
  }
}
