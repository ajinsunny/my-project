import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal } from './entities/goal.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class GoalService {
  constructor(
    @InjectRepository(Goal)
    private goalRepository: Repository<Goal>
  ) {}

  async createGoal(
    user: User,
    name: string,
    targetAmount: number,
    timeFrame: number
  ): Promise<Goal> {
    const goal = this.goalRepository.create({
      user,
      name,
      targetAmount,
      timeFrame,
    });
    return this.goalRepository.save(goal);
  }

  async findGoalsByUser(userId: number): Promise<Goal[]> {
    return this.goalRepository.find({ where: { user: { id: userId } } });
  }

  async deleteGoal(id: number): Promise<void> {
    await this.goalRepository.delete(id);
  }
}
