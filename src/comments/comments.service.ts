import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentDocument, Comment } from './schemas/comment.schema';

@Injectable()
export class CommentsService {
  constructor(@InjectModel(Comment.name) private CommentModel: Model<CommentDocument>) {}
}
