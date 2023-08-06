import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { v4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { SendgridService } from 'src/sendgrid/sendgrid.service';
import { Token, TokenDocument } from 'src/tokens/schemas/token.schema';
import { User, UserDocument } from './schemas/user.schema';
import { ResponseType } from './types/response.type';
import { EmailDto } from './dto/email.dto';
import { ChangeProfileDto } from './dto/change-profile.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Post, PostDocument } from 'src/posts/schemas/post.schema';
import { Comment, CommentDocument } from 'src/comments/schemas/comment.schema';
import { CommentsService } from 'src/comments/comments.service';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectModel(Token.name) private TokenModel: Model<TokenDocument>,
    @InjectModel(Post.name) private PostModel: Model<PostDocument>,
    @InjectModel(Comment.name) private CommentModel: Model<CommentDocument>,
    private readonly sendgridService: SendgridService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly commentsService: CommentsService,
    private readonly postService: PostsService,
  ) {}

  async activationEmail(activationToken: string): Promise<ResponseType | undefined> {
    const user = await this.UserModel.findOne({ activationToken });

    if (!user) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.NOT_FOUND,
          success: false,
          message: 'Activation token is wrong.',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    await this.UserModel.findByIdAndUpdate(user._id, { activationToken: null, isActivated: true });

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      message: 'Email is successfully activated.',
    };
  }

  async repeatActivationEmail(emailDto: EmailDto): Promise<ResponseType | undefined> {
    const user = await this.UserModel.findOne({ email: emailDto.email });

    if (!user) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.NOT_FOUND,
          success: false,
          message: 'User not found.',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const activationToken = v4();
    const mail = this.sendgridService.confirmEmail(user.email, activationToken);
    await this.sendgridService.sendEmail(mail);
    await this.UserModel.findByIdAndUpdate(user._id, { isActivated: false, activationToken });

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      message: 'The confirmation email has been sent again.',
    };
  }

  async getCurrentUser(
    userId: Types.ObjectId,
  ): Promise<ResponseType<UserDocument> | ResponseType | undefined> {
    if (!userId) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.UNAUTHORIZED,
          success: false,
          message: 'User not unauthorized.',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await this.UserModel.findById(userId);

    if (!user) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.NOT_FOUND,
          success: false,
          message: 'User not found.',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      data: user,
    };
  }

  async getAllUsers(): Promise<ResponseType<UserDocument[]> | undefined> {
    const users = await this.UserModel.find();

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      data: users,
    };
  }

  async changeProfile(
    userId: Types.ObjectId,
    changeProfileDto: ChangeProfileDto,
  ): Promise<ResponseType<UserDocument> | ResponseType | undefined> {
    if (!userId) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.UNAUTHORIZED,
          success: false,
          message: 'User not unauthorized.',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const updateUser = await this.UserModel.findByIdAndUpdate(userId, changeProfileDto, {
      new: true,
    });

    if (!updateUser) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.NOT_FOUND,
          success: false,
          message: 'User not found.',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      data: updateUser,
    };
  }

  async changeEmail(userId: Types.ObjectId, emailDto: EmailDto): Promise<ResponseType | undefined> {
    if (!userId) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.UNAUTHORIZED,
          success: false,
          message: 'User not unauthorized.',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const activationToken = v4();
    const email = this.sendgridService.confirmEmail(emailDto.email, activationToken);
    await this.sendgridService.sendEmail(email);

    await this.UserModel.findByIdAndUpdate(
      userId,
      {
        email: emailDto.email,
        activationToken,
        isActivated: false,
      },
      { new: true },
    );

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      message: 'The email address has been successfully changed, now you need to re-verify it.',
    };
  }

  async requestResetPassword(emailDto: EmailDto): Promise<ResponseType | undefined> {
    const user = await this.UserModel.findOne({ email: emailDto.email });

    if (!user) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.NOT_FOUND,
          success: false,
          message: 'User not found.',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const email = this.sendgridService.resetPassword(user.email, user.firstName);
    await this.sendgridService.sendEmail(email);

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      message: 'An email with a link to reset your password has been sent to your email address.',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<ResponseType | undefined> {
    const password = bcrypt.hashSync(resetPasswordDto.password, bcrypt.genSaltSync(10));
    const user = await this.UserModel.findOne({ email: resetPasswordDto.email });

    if (!user) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.NOT_FOUND,
          success: false,
          message: 'User not found.',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    await this.UserModel.findByIdAndUpdate(user._id, { password });

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      message: 'The password has been successfully changed.',
    };
  }

  async uploadAvatar(
    file: Express.Multer.File,
    userId: Types.ObjectId,
  ): Promise<ResponseType<UserDocument> | undefined> {
    const user = await this.UserModel.findById(userId);
    const publicId = this.cloudinaryService.getPublicId(user.avatarURL);

    if (!publicId.split('/').includes('default')) {
      await this.cloudinaryService.deleteFile(user.avatarURL, 'image');
    }

    const path = `fisher-blog-api/users/avatars/${userId}`;
    const result = await this.cloudinaryService.uploadFile(file, 'image', path);
    fs.unlinkSync(file.path);

    const updateUser = await this.UserModel.findByIdAndUpdate(
      userId,
      { avatarURL: result },
      { new: true },
    );

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      data: updateUser,
    };
  }

  async uploadPoster(
    file: Express.Multer.File,
    userId: Types.ObjectId,
  ): Promise<ResponseType<UserDocument> | undefined> {
    const user = await this.UserModel.findById(userId);
    const publicId = this.cloudinaryService.getPublicId(user.posterURL);

    if (!publicId.split('/').includes('default')) {
      await this.cloudinaryService.deleteFile(user.posterURL, 'image');
    }

    const path = `fisher-blog-api/users/posters/${userId}`;
    const result = await this.cloudinaryService.uploadFile(file, 'image', path);
    fs.unlinkSync(file.path);

    const updateUser = await this.UserModel.findByIdAndUpdate(
      userId,
      { posterURL: result },
      { new: true },
    );

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      data: updateUser,
    };
  }

  async chnangePassword(
    changePasswordDto: ChangePasswordDto,
    userId: Types.ObjectId,
  ): Promise<ResponseType | undefined> {
    const user = await this.UserModel.findById(userId);

    if (!user || !bcrypt.compareSync(changePasswordDto.password, user.password)) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.UNAUTHORIZED,
          success: false,
          message: 'User not unauthorized.',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const password = bcrypt.hashSync(changePasswordDto.newPassword, bcrypt.genSaltSync(10));
    await this.UserModel.findByIdAndUpdate(userId, { password });

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      message: 'Password has been successfully updated.',
    };
  }

  async removeProfile(userId: Types.ObjectId): Promise<ResponseType | undefined> {
    if (!userId) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.UNAUTHORIZED,
          success: false,
          message: 'User not unauthorized.',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await this.UserModel.findById(userId);
    await this.UserModel.findByIdAndRemove(userId);
    const tokens = await this.TokenModel.findOne({ owner: userId });
    await this.TokenModel.findByIdAndRemove(tokens._id);

    const avatarPublicId = this.cloudinaryService.getPublicId(user.avatarURL);
    const posterPublicId = this.cloudinaryService.getPublicId(user.posterURL);

    if (!avatarPublicId.split('/').includes('default')) {
      await this.cloudinaryService.deleteFile(user.avatarURL, 'image');
      await this.cloudinaryService.deleteFolder(`fisher-blog-api/users/avatars/${userId}`);
    }
    if (!posterPublicId.split('/').includes('default')) {
      await this.cloudinaryService.deleteFile(user.posterURL, 'image');
      await this.cloudinaryService.deleteFolder(`fisher-blog-api/users/posters/${userId}`);
    }

    const posts = await this.PostModel.find({ owner: userId });
    posts.map(async item => {
      await this.postService.deletePost(item._id.toString());
    });

    const comments = await this.CommentModel.find({ author: userId });
    comments.map(async item => {
      await this.commentsService.deleteComment(item._id.toString(), item.post.toString());
    });

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      message: 'Your account and all your data has been successfully deleted.',
    };
  }
}
