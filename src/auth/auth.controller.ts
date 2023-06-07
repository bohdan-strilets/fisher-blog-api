import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegistrationDto } from './dto/registration.dto';
import { Token } from 'src/tokens/schemas/token.schema';
import { UserDocument } from 'src/users/schemas/user.schema';
import { ResponseType } from './types/response.type';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  async registration(
    @Body() registrationDto: RegistrationDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseType<Token, UserDocument> | ResponseType | undefined> {
    const data = await this.authService.registration(registrationDto);
    res.cookie('refresh-token', data.tokens.refreshToken);
    return data;
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseType<Token, UserDocument> | ResponseType | undefined> {
    const data = await this.authService.login(loginDto);
    res.cookie('refresh-token', data.tokens.refreshToken);
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseType | undefined> {
    const refreshToken = req.cookies['refresh-token'];
    const data = await this.authService.logout(refreshToken);
    res.clearCookie('refresh-token');
    return data;
  }
}
