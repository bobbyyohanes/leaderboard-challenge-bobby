import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ScoresService } from './scores.service';
import { CreateScoreDto } from './dto/create-score.dto';
import { Throttle } from '@nestjs/throttler';

@Controller()
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  // Submit score, rate limited
  @UseGuards(AuthGuard('jwt'))
  @Throttle({ limit: 5, ttl: 60 } as any) 
  @Post('scores')
  async submitScore(@Req() req, @Body() dto: CreateScoreDto & { userId?: number }) {
    return this.scoresService.submitScore(req.user, dto.value, dto.userId);
  }

  // Get top 10 leaderboard
  @Get('leaderboard')
  async getLeaderboard() {
    const scores = await this.scoresService.getLeaderboard();
    return scores.map((s) => ({
      name: `${s.user.firstName} ${s.user.lastName ?? ''}`.trim(),
      score: s.value,
    }));
  }
}
