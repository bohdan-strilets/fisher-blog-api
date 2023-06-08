import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostDocument } from './schemas/post.schema';
import { ResponseType } from './types/response.type';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthRequest } from 'src/users/types/auth-request.type';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageValidator } from 'src/users/pipes/image-validator.pipe';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('all-posts')
  async getAllPosts(): Promise<ResponseType<PostDocument[]> | undefined> {
    const data = await this.postsService.getAllPosts();
    return data;
  }

  @Get('one-post/:postId')
  async getOnePost(
    @Param('postId') postId: string,
  ): Promise<ResponseType<PostDocument> | ResponseType | undefined> {
    const data = await this.postsService.getOnePost(postId);
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-post')
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @Req() req: AuthRequest,
  ): Promise<ResponseType<PostDocument> | ResponseType | undefined> {
    const { _id } = req.user;
    const data = await this.postsService.createPost(createPostDto, _id);
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-post/:postId')
  async updatePost(
    @Body() updatePostDto: UpdatePostDto,
    @Param('postId') postId: string,
  ): Promise<ResponseType<PostDocument> | ResponseType | undefined> {
    const data = await this.postsService.updatePost(updatePostDto, postId);
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('upload-poster/:postId')
  @UseInterceptors(FileInterceptor('poster', { dest: './public' }))
  async uploadPoster(
    @UploadedFile(imageValidator)
    file: Express.Multer.File,
    @Param('postId') postId: string,
  ): Promise<ResponseType<PostDocument> | ResponseType | undefined> {
    const data = await this.postsService.uploadPoster(file, postId);
    return data;
  }
}
