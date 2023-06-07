import {
  Controller,
  Get,
  Redirect,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  Put,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ResponseType } from './types/response.type';
import { EmailDto } from './dto/email.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserDocument } from './schemas/user.schema';
import { AuthRequest } from './types/auth-request.type';
import { ChangeProfileDto } from './dto/change-profile.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageValidator } from './pipes/image-validator.pipe';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('activation-email/:activationToken')
  @Redirect('http://localhost:3000')
  async activationEmail(
    @Param('activationToken') activationToken: string,
  ): Promise<ResponseType | undefined> {
    const data = await this.usersService.activationEmail(activationToken);
    return data;
  }

  @HttpCode(HttpStatus.OK)
  @Post('repeat-activation-email')
  async repeatActivationEmail(@Body() emailDto: EmailDto): Promise<ResponseType | undefined> {
    const data = await this.usersService.repeatActivationEmail(emailDto);
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Get('current-user')
  async getCurrentUser(
    @Req() req: AuthRequest,
  ): Promise<ResponseType<UserDocument> | ResponseType | undefined> {
    const { _id } = req.user;
    const data = await this.usersService.getCurrentUser(_id);
    return data;
  }

  @Get('all-users')
  async getAllUsers(): Promise<ResponseType<UserDocument[]> | undefined> {
    const data = await this.usersService.getAllUsers();
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Put('change-profile')
  async changeProfile(
    @Body() changeProfileDto: ChangeProfileDto,
    @Req() req: AuthRequest,
  ): Promise<ResponseType<UserDocument> | ResponseType | undefined> {
    const { _id } = req.user;
    const data = await this.usersService.changeProfile(_id, changeProfileDto);
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-email')
  async changeEmail(
    @Body() emailDto: EmailDto,
    @Req() req: AuthRequest,
  ): Promise<ResponseType | undefined> {
    const { _id } = req.user;
    const data = await this.usersService.changeEmail(_id, emailDto);
    return data;
  }

  @HttpCode(HttpStatus.OK)
  @Post('request-reset-password')
  async requestResetPassword(@Body() emailDto: EmailDto): Promise<ResponseType | undefined> {
    const data = await this.usersService.requestResetPassword(emailDto);
    return data;
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-password/:userId')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Param('userId') userId: string,
  ): Promise<ResponseType | undefined> {
    const data = await this.usersService.resetPassword(resetPasswordDto, userId);
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('avatar', { dest: './public' }))
  async uploadAvatar(
    @UploadedFile(imageValidator)
    file: Express.Multer.File,
    @Req() req: AuthRequest,
  ): Promise<ResponseType<UserDocument> | undefined> {
    const { _id } = req.user;
    const data = await this.usersService.uploadAvatar(file, _id);
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('upload-poster')
  @UseInterceptors(FileInterceptor('poster', { dest: './public' }))
  async uploadPoster(
    @UploadedFile(imageValidator)
    file: Express.Multer.File,
    @Req() req: AuthRequest,
  ): Promise<ResponseType<UserDocument> | undefined> {
    const { _id } = req.user;
    const data = await this.usersService.uploadPoster(file, _id);
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  async chnangePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: AuthRequest,
  ): Promise<ResponseType | undefined> {
    const { _id } = req.user;
    const data = await this.usersService.chnangePassword(changePasswordDto, _id);
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Get('remove-profile')
  async removeProfile(@Req() req: AuthRequest): Promise<ResponseType | undefined> {
    const { _id } = req.user;
    const data = await this.usersService.removeProfile(_id);
    return data;
  }
}
