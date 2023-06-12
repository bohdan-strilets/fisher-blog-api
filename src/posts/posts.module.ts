import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { PostSchema, Post } from './schemas/post.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]), CloudinaryModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
