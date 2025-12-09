import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Score } from "src/entities/score.entity";
import { User, UserRole } from "src/entities/user.entity";
import { Repository } from "typeorm";


@Injectable()
export class ScoresService {
  private readonly logger = new Logger(ScoresService.name);

  constructor(
    @InjectRepository(Score) private readonly repo: Repository<Score>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async submitScore(user: User, value: number, userId?: number): Promise<Score> {
    try {
      if (user.role !== UserRole.ADMIN && userId && userId !== user.userId)
        throw new ForbiddenException('Cannot submit score for other users');

      const targetUser = await this.userRepo.findOne({ where: { userId: userId ?? user.userId } });
      if (!targetUser) throw new NotFoundException('User not found');

      const score = this.repo.create({ value, user: targetUser });
      const saved = await this.repo.save(score);

      this.logger.log(`Score submitted by ${user.email}: ${value}`);
      return saved;
    } catch (error) {
      this.logger.error(`Failed to submit score: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getLeaderboard() {
    try {
      return this.repo
        .createQueryBuilder('score')
        .leftJoinAndSelect('score.user', 'user')
        .orderBy('score.value', 'DESC')
        .limit(10)
        .getMany();
    } catch (error) {
      this.logger.error(`Failed to get leaderboard: ${error.message}`, error.stack);
      throw new BadRequestException('Unable to fetch leaderboard');
    }
  }
}
