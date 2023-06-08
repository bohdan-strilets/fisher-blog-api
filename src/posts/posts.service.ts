import { HttpException, HttpStatus, Injectable, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PostDocument } from './schemas/post.schema';
import { ResponseType } from './types/response.type';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private PostModel: Model<PostDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getAllPosts(): Promise<ResponseType<PostDocument[]> | undefined> {
    const posts = await this.PostModel.find({ isPublic: true });

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      data: posts,
    };
  }

  async getOnePost(postId: string): Promise<ResponseType<PostDocument> | ResponseType | undefined> {
    const post = await this.PostModel.findOne({ _id: postId, isPublic: true });

    if (!post) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.NOT_FOUND,
          success: false,
          message: 'Post with current ID not found.',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      data: post,
    };
  }
}
