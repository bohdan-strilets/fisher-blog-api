import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Post } from 'src/posts/schemas/post.schema';
import { User } from 'src/users/schemas/user.schema';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ versionKey: false, timestamps: true })
export class Comment {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
  post: Post;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: User;

  @Prop({ required: true })
  text: string;

  @Prop({ default: [] })
  likes: Types.ObjectId[];

  @Prop({ default: 0 })
  numberLikes: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
