import { HttpException, HttpStatus, Injectable, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PostDocument } from './schemas/post.schema';
import { ResponseType } from './types/response.type';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

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

  async createPost(
    createPostDto: CreatePostDto,
    userId: Types.ObjectId,
  ): Promise<ResponseType<PostDocument> | ResponseType | undefined> {
    if (!createPostDto) {
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

    const posterURL =
      'https://res.cloudinary.com/ddd1vgg5b/image/upload/v1686231559/fisher-blog-api/posts/default/tfwv2iytx6aisquz4yj8.jpg';

    const newPost = await this.PostModel.create({
      ...createPostDto,
      owner: userId,
      posterURL,
    });

    return {
      status: 'success',
      code: HttpStatus.CREATED,
      success: true,
      data: newPost,
    };
  }

  async updatePost(
    updatePostDto: UpdatePostDto,
    postId: string,
  ): Promise<ResponseType<PostDocument> | ResponseType | undefined> {
    if (!updatePostDto) {
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

    const updatePost = await this.PostModel.findByIdAndUpdate(postId, updatePostDto, { new: true });

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      data: updatePost,
    };
  }
}
