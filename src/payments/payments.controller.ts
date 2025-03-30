import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get(':walletAddress')
  findOne(@Param('walletAddress') walletAddress: string) {
    return this.paymentsService.findOne(walletAddress);
  }

  @Get(':walletAddress/status')
  getPaymentStatus(@Param('walletAddress') walletAddress: string) {
    return this.paymentsService.getPaymentStatus(walletAddress);
  }
} 