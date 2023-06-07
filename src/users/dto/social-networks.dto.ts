import { IsString, MaxLength, IsOptional, Matches, IsUrl } from 'class-validator';

const regexFacebook = /^(https?:\/\/)?(www\.)?facebook.com\/[a-zA-Z0-9.]+$/i;
const regexInstagram = /^(https?:\/\/)?(www\.)?instagram.com\/[a-zA-Z0-9_]+\/?$/i;
const regexTwitter = /^(https?:\/\/)?(www\.)?twitter.com\/[a-zA-Z0-9_]+\/?$/i;
const regexPinterest = /^(https?:\/\/)?(www\.)?pinterest.com\/[a-zA-Z0-9_-]+\/?$/i;

export class SocialNetworksDto {
  @IsString()
  @IsUrl()
  @MaxLength(255)
  @IsOptional()
  @Matches(regexFacebook)
  facebook?: string;

  @IsString()
  @IsUrl()
  @MaxLength(255)
  @IsOptional()
  @Matches(regexInstagram)
  instagram?: string;

  @IsString()
  @IsUrl()
  @MaxLength(255)
  @IsOptional()
  @Matches(regexTwitter)
  twitter?: string;

  @IsString()
  @IsUrl()
  @MaxLength(255)
  @IsOptional()
  @Matches(regexPinterest)
  regexPinterest?: string;
}
