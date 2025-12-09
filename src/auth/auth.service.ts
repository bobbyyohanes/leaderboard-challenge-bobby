// import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Injectable, NotFoundException, Logger, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    try {
      const exists = await this.repo.findOne({ where: { email: dto.email } });
      if (exists) throw new BadRequestException('Email already used');

      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const user = this.repo.create({
        firstName: dto.firstName,
        lastName: dto.lastName ?? '',
        email: dto.email,
        password: hashedPassword,
        role: UserRole.USER,
      });

      const savedUser = await this.repo.save(user);
      this.logger.log(`User registered: ${dto.email}`);
      return { message: 'User registered successfully', userId: savedUser.userId };
    } catch (error) {
      this.logger.error(`Registration failed for ${dto.email}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async login(dto: LoginDto) {
    try {
      const user = await this.repo.findOne({ where: { email: dto.email } });
      if (!user) throw new UnauthorizedException('Invalid credentials');

      const isPasswordValid = await bcrypt.compare(dto.password, user.password);
      if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

      const payload = { userId: user.userId, role: user.role };
      const access_token = await this.jwtService.signAsync(payload);

      this.logger.log(`User logged in: ${dto.email}`);
      return {
        access_token,
        user: { userId: user.userId, email: user.email, role: user.role },
      };
    } catch (error) {
      this.logger.error(`Login failed for ${dto.email}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
