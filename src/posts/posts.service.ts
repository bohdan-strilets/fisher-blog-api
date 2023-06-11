import { HttpException, HttpStatus, Injectable, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as fs from 'fs';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PostDocument } from './schemas/post.schema';
import { ResponseType } from './types/response.type';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import averageReadingTime from './helpers/average-reading-time';

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

    const readingTime = averageReadingTime(createPostDto.body);
    const posterURL =
      'https://res.cloudinary.com/ddd1vgg5b/image/upload/v1686231559/fisher-blog-api/posts/default/tfwv2iytx6aisquz4yj8.jpg';

    const newPost = await this.PostModel.create({
      ...createPostDto,
      owner: userId,
      posterURL,
      statistics: {
        readingTime,
      },
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
    const readingTime = averageReadingTime(updatePost.body);
    const result = await this.PostModel.findByIdAndUpdate(
      postId,
      { statistics: { readingTime } },
      { new: true },
    );

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      data: result,
    };
  }

  async uploadPoster(
    file: Express.Multer.File,
    postId: string,
  ): Promise<ResponseType<PostDocument> | ResponseType | undefined> {
    const post = await this.PostModel.findById(postId);
    const publicId = this.cloudinaryService.getPublicId(post.posterURL);

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

    if (!publicId.split('/').includes('default')) {
      await this.cloudinaryService.deleteFile(post.posterURL, 'image');
    }

    const path = `fisher-blog-api/posts/posters/${postId}`;
    const result = await this.cloudinaryService.uploadFile(file, 'image', path);
    fs.unlinkSync(file.path);

    const updatePost = await this.PostModel.findByIdAndUpdate(
      postId,
      { posterURL: result },
      { new: true },
    );

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      data: updatePost,
    };
  }

  async uploadImage(
    file: Express.Multer.File,
    postId: string,
  ): Promise<ResponseType<PostDocument> | ResponseType | undefined> {
    const path = `fisher-blog-api/posts/images/${postId}`;
    const result = await this.cloudinaryService.uploadFile(file, 'image', path);
    fs.unlinkSync(file.path);

    const updatePost = await this.PostModel.findByIdAndUpdate(
      postId,
      { $push: { imagesURL: result } },
      { new: true },
    );

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      data: updatePost,
    };
  }

  async uploadVideo(
    file: Express.Multer.File,
    postId: string,
  ): Promise<ResponseType<PostDocument> | ResponseType | undefined> {
    const path = `fisher-blog-api/posts/videos/${postId}`;
    const result = await this.cloudinaryService.uploadFile(file, 'video', path);
    fs.unlinkSync(file.path);

    const updatePost = await this.PostModel.findByIdAndUpdate(
      postId,
      { $push: { videosURL: result } },
      { new: true },
    );

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      data: updatePost,
    };
  }

  async updatePublic(
    postId: string,
  ): Promise<ResponseType<PostDocument> | ResponseType | undefined> {
    const post = await this.PostModel.findOne({ _id: postId });

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

    const updatePost = await this.PostModel.findByIdAndUpdate(
      post._id,
      { isPublic: !post.isPublic },
      { new: true },
    );

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      data: updatePost,
    };
  }

  async viewPost(postId: string): Promise<ResponseType<PostDocument> | ResponseType | undefined> {
    const post = await this.PostModel.findOne({ _id: postId });

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

    const updatePost = await this.PostModel.findByIdAndUpdate(
      post._id,
      { $inc: { 'statistics.numberViews': 1 } },
      { new: true },
    );

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      data: updatePost,
    };
  }

  async likePost(
    postId: string,
    userId: Types.ObjectId,
  ): Promise<ResponseType<PostDocument> | ResponseType | undefined> {
    const post = await this.PostModel.findOne({ _id: postId });

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

    const isLikes = post.likes.find(item => item === userId);
    let updatePost: PostDocument;

    if (!isLikes) {
      updatePost = await this.PostModel.findByIdAndUpdate(
        postId,
        { $push: { likes: userId }, $inc: { 'statistics.numberLikes': 1 } },
        { new: true },
      );
    } else {
      updatePost = await this.PostModel.findByIdAndUpdate(
        postId,
        { $pull: { likes: userId }, $inc: { 'statistics.numberLikes': -1 } },
        { new: true },
      );
    }

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      data: updatePost,
    };
  }
}
