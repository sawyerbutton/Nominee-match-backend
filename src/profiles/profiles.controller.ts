import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profilesService.create(createProfileDto);
  }

  @Get()
  findAll() {
    return this.profilesService.findAll();
  }

  @Get(':walletAddress')
  findOne(@Param('walletAddress') walletAddress: string) {
    return this.profilesService.findOne(walletAddress);
  }

  @Patch(':walletAddress')
  update(
    @Param('walletAddress') walletAddress: string,
    @Body() updateProfileDto: Partial<CreateProfileDto>
  ) {
    return this.profilesService.update(walletAddress, updateProfileDto);
  }

  @Delete(':walletAddress')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('walletAddress') walletAddress: string) {
    return this.profilesService.remove(walletAddress);
  }
} 