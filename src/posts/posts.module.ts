import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { PostSchema, Post } from './schemas/post.schema';
import { CommentSchema, Comment } from 'src/comments/schemas/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
    CloudinaryModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
