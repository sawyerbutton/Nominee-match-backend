import { IsString, IsNotEmpty, IsArray, IsOptional, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { IsEthAddress } from '../../developers/validators/is-eth-address.validator';

class ExperienceDto {
  @IsString()
  @IsNotEmpty()
  company: string;

  @IsString()
  @IsNotEmpty()
  position: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

class EducationDto {
  @IsString()
  @IsNotEmpty()
  school: string;

  @IsString()
  @IsNotEmpty()
  degree: string;

  @IsString()
  @IsNotEmpty()
  field: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  @IsEthAddress()
  walletAddress: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  bio: string;

  @IsArray()
  @IsString({ each: true })
  skills: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExperienceDto)
  experience: ExperienceDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationDto)
  education: EducationDto[];
} 