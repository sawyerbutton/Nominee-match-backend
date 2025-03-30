import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { DevelopersService } from './developers.service';
import { CreateDeveloperDto } from './dto/create-developer.dto';

@Controller('developers')
export class DevelopersController {
  constructor(private readonly developersService: DevelopersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDeveloperDto: CreateDeveloperDto) {
    return this.developersService.create(createDeveloperDto);
  }

  @Get()
  findAll() {
    return this.developersService.findAll();
  }

  @Get(':walletAddress')
  findOne(@Param('walletAddress') walletAddress: string) {
    return this.developersService.findOne(walletAddress);
  }

  @Patch(':walletAddress')
  update(
    @Param('walletAddress') walletAddress: string,
    @Body() updateDeveloperDto: Partial<CreateDeveloperDto>
  ) {
    return this.developersService.update(walletAddress, updateDeveloperDto);
  }

  @Delete(':walletAddress')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('walletAddress') walletAddress: string) {
    return this.developersService.remove(walletAddress);
  }
} 