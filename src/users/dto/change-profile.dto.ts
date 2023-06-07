import {
  IsString,
  IsDateString,
  IsPhoneNumber,
  IsArray,
  IsIn,
  MinLength,
  MaxLength,
  IsOptional,
  ArrayUnique,
  ValidateNested,
} from 'class-validator';
import { LocationDto } from './location.dto';
import { SocialNetworksDto } from './social-networks.dto';

export class ChangeProfileDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsOptional()
  firstName?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsOptional()
  lastName?: string;

  @IsDateString()
  @IsOptional()
  dateBirth?: Date;

  @IsString()
  @IsIn(['man', 'woman', 'other'])
  @IsOptional()
  gender?: string;

  @IsString()
  @MinLength(10)
  @MaxLength(500)
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  profession?: string;

  @IsString()
  @IsPhoneNumber('PL')
  @IsOptional()
  phoneNumber?: string;

  @ValidateNested()
  @IsOptional()
  location?: LocationDto;

  @ValidateNested()
  @IsOptional()
  socialNetworks?: SocialNetworksDto;

  @IsArray()
  @ArrayUnique()
  @IsOptional()
  hobby?: string[];
}
