import { Controller, Get } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostDocument } from './schemas/post.schema';
import { ResponseType } from './types/response.type';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('all-posts')
  async getAllPosts(): Promise<ResponseType<PostDocument[]> | undefined> {
    const data = await this.postsService.getAllPosts();
    return data;
  }
}
