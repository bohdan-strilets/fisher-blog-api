import { IsString, MinLength, MaxLength } from 'class-validator';

export class CommentDto {
  @IsString()
  @MinLength(30)
  @MaxLength(1000)
  text: string;
}
