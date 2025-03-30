import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { IsEthAddress } from '../validators/is-eth-address.validator';

export class CreateDeveloperDto {
  @IsString()
  @IsNotEmpty()
  @IsEthAddress()
  walletAddress: string;

  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsString()
  @IsOptional()
  description?: string;
} 