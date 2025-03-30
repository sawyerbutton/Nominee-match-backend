import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { CreateMatchingDto } from './dto/create-matching.dto';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user?: {
    id: string;
    email: string;
  };
}

@Controller('matching')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Post('find-matches')
  async findMatches(
    @Req() req: RequestWithUser,
    @Body() createMatchingDto: CreateMatchingDto
  ) {
    // 从请求中获取用户ID
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('用户未认证');
    }
    return this.matchingService.findMatches(userId, createMatchingDto);
  }
} 