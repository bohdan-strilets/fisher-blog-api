import { IsString, MinLength, MaxLength } from 'class-validator';

export class UpdateCommentDto {
  @IsString()
  @MinLength(30)
  @MaxLength(1000)
  text: string;
}
