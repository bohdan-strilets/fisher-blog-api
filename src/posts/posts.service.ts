import { HttpStatus, Injectable, Post } from '@nestjs/common';
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
}
