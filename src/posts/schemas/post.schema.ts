import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { PostBodyType } from '../types/post-body.type';
import { Statistics, StatisticsDocument } from './statistics.schema';
import { CommentType } from '../types/comment.type';

export type PostDocument = HydratedDocument<Post>;

@Schema({ versionKey: false, timestamps: true })
export class Post {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  body: PostBodyType[];

  @Prop({ required: true })
  category: string[];

  @Prop({ default: [] })
  tags: string[];

  @Prop({ type: Statistics, default: {} })
  statistics: StatisticsDocument;

  @Prop({ default: [] })
  comments: CommentType[];

  @Prop({ required: true })
  posterURL: string;

  @Prop({ default: [] })
  imagesURL: string[];

  @Prop({ default: [] })
  videosURL: string[];

  @Prop({ default: true })
  isPublic: boolean;

  @Prop({ default: [] })
  likes: Types.ObjectId[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
