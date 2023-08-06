import { IsNotEmpty, IsString, MinLength, MaxLength, IsEmail } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(16)
  password: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
