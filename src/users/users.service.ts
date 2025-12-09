import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  async findAll(): Promise<User[]> {
    try {
      return this.repo.find();
    } catch (error) {
      this.logger.error(`Failed to fetch users: ${error.message}`, error.stack);
      throw new BadRequestException('Unable to fetch users');
    }
  }

  async findOneOrFail(userId: number): Promise<User> {
    try {
      const user = await this.repo.findOne({ where: { userId } });
      if (!user) throw new NotFoundException(`User ${userId} not found`);
      return user;
    } catch (error) {
      this.logger.error(`Failed to fetch user ${userId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async create(dto: CreateUserDto): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const newUser = this.repo.create({ ...dto, password: hashedPassword });
      const saved = await this.repo.save(newUser);
      this.logger.log(`User created with id ${saved.userId}`);
      return saved;
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`, error.stack);
      throw new BadRequestException('Unable to create user');
    }
  }

  async update(userId: number, dto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.repo.preload({ userId, ...dto });
      if (!user) throw new NotFoundException(`User ${userId} not found`);
      const updated = await this.repo.save(user);
      this.logger.log(`User ${userId} updated`);
      return updated;
    } catch (error) {
      this.logger.error(`Failed to update user ${userId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(userId: number): Promise<void> {
    try {
      const user = await this.findOneOrFail(userId);
      await this.repo.softRemove(user);
      this.logger.log(`User ${userId} soft-deleted`);
    } catch (error) {
      this.logger.error(`Failed to delete user ${userId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async restore(userId: number): Promise<void> {
    try {
      const result = await this.repo.restore(userId);
      if (result.affected === 0) throw new NotFoundException(`User ${userId} not found to restore`);
      this.logger.log(`User ${userId} restored`);
    } catch (error) {
      this.logger.error(`Failed to restore user ${userId}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
