import { Module, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from './users/users.module';
import { ScoresModule } from './scores/scores.module';
import { AuthModule } from './auth/auth.module';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';

import { User } from './entities/user.entity';
import { Score } from './entities/score.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'leaderboard_bobby',
      entities: [User, Score],
      synchronize: true, // hanya untuk dev
    }),

    JwtModule.register({
      secret: 'SECRET123',
      signOptions: { expiresIn: '1d' },
    }),

    ThrottlerModule.forRoot({
      ttl: 60,  
      limit: 5,     } as any),

    AuthModule,
    UsersModule,
    ScoresModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
