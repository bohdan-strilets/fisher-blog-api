import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommentDocument, Comment } from './schemas/comment.schema';
import { ResponseType } from './types/response.type';
import { CommentDto } from './dto/comment.dto';

@Injectable()
export class CommentsService {
  constructor(@InjectModel(Comment.name) private CommentModel: Model<CommentDocument>) {}

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

  async createComment(
    postId: string,
    userId: Types.ObjectId,
    createCommentDto: CommentDto,
  ): Promise<ResponseType<CommentDocument> | ResponseType | undefined> {
    if (!createCommentDto) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Check correct entered data.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const newComment = await this.CommentModel.create({
      ...createCommentDto,
      post: postId,
      author: userId,
    });

    return {
      status: 'success',
      code: HttpStatus.CREATED,
      success: true,
      data: newComment,
    };
  }

  async updateComment(
    commentId: string,
    updateCommentDto: CommentDto,
  ): Promise<ResponseType<CommentDocument> | ResponseType | undefined> {
    if (!updateCommentDto) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Check correct entered data.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!commentId) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.UNAUTHORIZED,
          success: false,
          message: 'Comment with current ID not found.',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const updateComment = await this.CommentModel.findByIdAndUpdate(commentId, updateCommentDto, {
      new: true,
    });

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      data: updateComment,
    };
  }

  async deleteComment(commentId: string): Promise<ResponseType | undefined> {
    if (!commentId) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.UNAUTHORIZED,
          success: false,
          message: 'Comment with current ID not found.',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.CommentModel.findByIdAndRemove(commentId);

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
    };
  }
}
