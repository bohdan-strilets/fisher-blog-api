import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class LocationDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @IsOptional()
  country?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  postcode?: string;
}
