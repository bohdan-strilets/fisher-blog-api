import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SendgridModule } from 'src/sendgrid/sendgrid.module';
import { Token, TokenSchema } from 'src/tokens/schemas/token.schema';
import { User, UserSchema } from './schemas/user.schema';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { Post, PostSchema } from 'src/posts/schemas/post.schema';
import { Comment, CommentSchema } from 'src/comments/schemas/comment.schema';
import { CommentsModule } from 'src/comments/comments.module';
import { PostsModule } from 'src/posts/posts.module';
import { TokensModule } from 'src/tokens/tokens.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Token.name, schema: TokenSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
    SendgridModule,
    CloudinaryModule,
    CommentsModule,
    PostsModule,
    TokensModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
