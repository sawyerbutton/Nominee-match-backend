import { IsString, IsArray, IsNotEmpty } from 'class-validator';

export class CreateMatchingDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  skills: string[];

  @IsString()
  @IsNotEmpty()
  experience: string;

  @IsString()
  @IsNotEmpty()
  interests: string;
} 