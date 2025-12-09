import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScoresService } from './scores.service';
import { ScoresController } from './scores.controller';
import { Score } from '../entities/score.entity';
import { User } from '../entities/user.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Score, User]), // inject repository Score + User
    UsersModule, // optional, kalau service Scores butuh UsersService
  ],
  providers: [ScoresService],
  controllers: [ScoresController],
})
export class ScoresModule {}
