import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsArray,
  ArrayUnique,
  ArrayMinSize,
  IsOptional,
} from 'class-validator';
import { PostBodyType } from '../types/post-body.type';

export class UpdatePostDto {
  @IsString()
  @MinLength(30)
  @MaxLength(70)
  title: string;

  @IsArray()
  @IsNotEmpty()
  @ArrayUnique()
  @ArrayMinSize(1)
  body: PostBodyType[];

  @IsArray()
  @IsNotEmpty()
  @ArrayUnique()
  @ArrayMinSize(1)
  category: string[];

  @IsArray()
  @ArrayUnique()
  @IsOptional()
  tags?: string[];
}
