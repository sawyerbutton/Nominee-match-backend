import { Module } from '@nestjs/common';
import { DevelopersService } from './developers.service';
import { DevelopersController } from './developers.controller';
import { IsEthAddressConstraint } from './validators/is-eth-address.validator';

@Module({
  controllers: [DevelopersController],
  providers: [DevelopersService, IsEthAddressConstraint],
  exports: [DevelopersService]
})
export class DevelopersModule {} 