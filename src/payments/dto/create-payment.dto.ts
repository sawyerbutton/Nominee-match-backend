import { IsString, IsNotEmpty, Matches } from 'class-validator';
import { IsEthAddress } from '../../developers/validators/is-eth-address.validator';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  @IsEthAddress()
  walletAddress: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]+$/, { message: '金额必须是有效的数字' })
  amount: string; // Amount in wei
} 